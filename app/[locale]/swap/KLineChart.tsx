'use client';
import { Box, Flex } from '@chakra-ui/react';
import { useState, useEffect, useCallback, useRef } from 'react';
import klinecharts, { init, Chart as KLineChartType } from 'klinecharts';
// import * as echarts from "echarts";
import 'echarts/lib/component/markLine';
import { formatNumber } from '@/lib';
import { DECIMAL } from '@/constants';
import { useLanguage } from '@/components/Language';

interface HistoryData {
  close: string;
  high: string;
  low: string;
  open: string;
  time: number;
  volume: string;
}

interface ChartData {
  datas: Array<{
    timestamp: number;
    // 开盘价，必要字段
    open: number;
    // 收盘价，必要字段
    close: number;
    // 最高价，必要字段
    high: number;
    // 最低价，必要字段
    low: number;
    // 成交量，非必须字段
    volume: number;
    // 成交额，非必须字段，如果需要展示技术指标'EMV'和'AVP'，则需要为该字段填充数据。
    turnover?: number;
  }>;
  times: Array<string>;
}

interface WSData {
  sub: string;
  data: Array<HistoryData>;
  code: number;
  type: string;
  client_id: string;
}

type SubType = 'hour' | 'day' | 'week' | 'month' | 'year';
const formatData = (data: Array<HistoryData>, type: SubType) => {
  return data.reduce<ChartData>(
    (memo, item) => {
      const { close, high, low, open, time, volume } = item;
      memo.times.push(`${formatTimestamp(time * 1000, type)}`);

      memo.datas.push({
        timestamp: time * 1000,
        open: +open,
        high: +high,
        low: +low,
        close: +close,
        volume: +volume
      });
      // memo.datas.push([+open, +close, +low, +high, +volume])
      return memo;
    },
    {
      datas: [],
      times: []
    }
  );
};

const formatTimestamp = (timestamp: number, type: SubType): string => {
  const date = new Date(timestamp);
  // const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  if (type === 'hour') return `${hours}:${minutes}`;
  return `${month}/${day}`;
  // return `${month}/${day} ${hours}:${minutes}`;
};

const KLineChart = ({
  onChangePrice
}: {
  onChangePrice: (price: number) => void;
}) => {
  const { currentLang } = useLanguage();
  const main = useRef<HTMLDivElement>(null);
  const [type, setType] = useState<SubType>('hour');
  const [chart, setChart] = useState<KLineChartType | null>();
  const [price, setPrice] = useState(0);
  const [socket, setSocket] = useState<WebSocket>();
  const time: any = useRef();

  const [chartData, setData] = useState<ChartData>({
    times: [],
    datas: []
  });

  const handPing = useCallback(
    (ws: WebSocket) => {
      if (ws.readyState !== 1) return;
      ws?.send(JSON.stringify({ type: 'ping', msg: '' }));
      time.current = setInterval(() => {
        if (ws.readyState !== 1) {
          clearInterval(time.current);
          return;
        }
        ws?.send(JSON.stringify({ type: 'ping', msg: '' }));
      }, 5000);
    },
    [time]
  );

  const handUnSub = useCallback(() => {
    socket?.send(JSON.stringify({ type: 'unsub', msg: `newPrice_${type}` }));
  }, [socket, type]);

  const handChangeType = useCallback(
    (value: SubType) => {
      handUnSub();
      setData({
        datas: [],
        times: []
      });
      setType((value as SubType) || 'hour');

      setTimeout(() => {
        socket?.send(JSON.stringify({ type: 'req', msg: `${value}` }));
        socket?.send(JSON.stringify({ type: 'sub', msg: `newPrice_${value}` }));
      }, 1000);
    },
    [handUnSub, setData, setType, socket]
  );

  useEffect(() => {
    if (main.current && !chart) {
      (klinecharts as any).registerLocale('zh-Hant', {
        time: '時間：',
        open: '開：',
        high: '高：',
        low: '低：',
        close: '收：',
        volume: '成交量：',
        turnover: '成交額：',
        change: '漲幅：'
      });
      (klinecharts as any).registerLocale('ja', {
        time: '時間：',
        open: '始値：',
        high: '高値：',
        low: '安値：',
        close: '終値：',
        volume: '出来高：',
        turnover: '取引額：',
        change: '変化率：'
      });
      (klinecharts as any).registerLocale('ko', {
        time: '시간：',
        open: '시가：',
        high: '고가：',
        low: '저가：',
        close: '종가：',
        volume: '거래량：',
        turnover: '거래대금：',
        change: '변동률：'
      });
      const _chart = init(main.current, {
        styles: {
          grid: {
            show: false
          },
          candle: {
            tooltip: {
              offsetTop: 0
            }
          },
          xAxis: {
            axisLine: {
              color: 'rgba(255, 255, 255, 0.24)'
            },
            tickLine: {
              color: 'rgba(255, 255, 255, 0.24)'
            },
            tickText: {
              color: 'rgba(255, 255, 255, 0.24)'
            }
          },
          yAxis: {
            axisLine: {
              color: 'rgba(255, 255, 255, 0.24)'
            },
            tickLine: {
              color: 'rgba(255, 255, 255, 0.24)'
            },
            tickText: {
              color: 'rgba(255, 255, 255, 0.24)'
            }
          }
        }
      } as any);

      _chart?.setPriceVolumePrecision(DECIMAL, DECIMAL);
      (_chart as any)?.setLocale(currentLang.path);
      setChart(_chart);
      handChangeType(type);
    }

    let ws: WebSocket;
    if (!socket) {
      if (chart) return;
      ws = new WebSocket(process.env.NEXT_PUBLIC_WS_BASE_URL as string);
    } else {
      ws = socket;
    }

    ws.onopen = () => {
      handPing(ws);
      setSocket(ws);
      setTimeout(() => {
        if (ws.readyState !== 1) return;
        ws.send(JSON.stringify({ type: 'req', msg: `${type}` }));
        setTimeout(() => {
          ws.send(JSON.stringify({ type: 'sub', msg: `newPrice_${type}` }));
        }, 1000);
        console.log('conmect success');
      }, 500);
    };

    // 处理连接关闭
    ws.onclose = () => {
      clearInterval(time.current);
      console.log('WebSocket connection closed');
    };

    // 清理函数
    return () => {
      // ws.close();
    };
  }, [
    type,
    currentLang,
    handChangeType,
    handPing,
    main,
    socket,
    setSocket,
    chart
  ]);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = ({ data }) => {
      const res = JSON.parse(data) as WSData;
      if (!res.sub) return;
      if (res.sub === `${type}`) {
        chart?.applyNewData(formatData(res.data, type).datas);
        setData(formatData(res.data, type));
      }
      if (res.sub.indexOf('newPrice') !== -1) {
        const { close, high, low, open, time, volume } = res.data as any;

        chart?.updateData({
          timestamp: time * 1000,
          open: +open,
          high: +high,
          low: +low,
          close: +close,
          volume: +volume
        });
        setPrice(+close);
        onChangePrice(+close);
      }
    };
  }, [socket, onChangePrice, chart, chartData, setData, type]);

  useEffect(() => {
    return () => {
      socket?.close();
      // dispose(chart as KLineChartType);
    };
  }, [socket]);

  const handleResize = useCallback(() => {
    chart?.resize();
  }, [chart]);

  useEffect(() => {
    window.addEventListener('resize', handleResize, false);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize, chart]);

  return (
    <Flex
      flexDir={'column'}
      overflowX={'hidden'}
      w={'full'}
    >
      <Flex
        alignItems={'center'}
        fontSize={'xs'}
        gap={'30'}
        justify={'space-between'}
      >
        <Box>USDT/DIALECT:&nbsp;${formatNumber(`${price}`)}</Box>
        <Flex
          color={'whiteAlpha.400'}
          gap={4}
        >
          <Box
            color={type === 'hour' ? 'white' : ''}
            onClick={() => handChangeType('hour')}
          >
            Hour
          </Box>
          <Box
            color={type === 'day' ? 'white' : ''}
            onClick={() => handChangeType('day')}
          >
            Day
          </Box>
          <Box
            color={type === 'week' ? 'white' : ''}
            onClick={() => handChangeType('week')}
          >
            Week
          </Box>
        </Flex>
      </Flex>
      <Box
        h={'340px'}
        mt={'5'}
        ref={main}
      ></Box>
    </Flex>
  );
};

export default KLineChart;

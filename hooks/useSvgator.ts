import { RefObject, useEffect, useRef, useState } from 'react';

interface svgatorProps {
  el: string;
  iconName: string;
}

export interface SVGatorPlayerInstance {
  currentTime: number;
  direction: number;
  duration: number;
  fill: number;
  fps: number;
  hasEnded: boolean;
  isAlternate: boolean;
  isBackwards: boolean;
  isInfinite: boolean;
  isPlaying: boolean;
  isReversed: boolean;
  isRollingBack: boolean;
  iterations: number;
  speed: number;
  state: 'playing' | 'paused' | 'ended' | 'rollback';
  totalTime: number;

  play(): SVGatorPlayerInstance;
  pause(): SVGatorPlayerInstance;
  restart(): SVGatorPlayerInstance;
  reverse(): SVGatorPlayerInstance;
  toggle(): SVGatorPlayerInstance;
  togglePlay(): SVGatorPlayerInstance;
  stop(): SVGatorPlayerInstance;
  ready(
    callback: (player: SVGatorPlayerInstance) => void
  ): SVGatorPlayerInstance;
  seek(offsetPercent: number): SVGatorPlayerInstance;
  seekBy(offsetMs: number): SVGatorPlayerInstance;
  seekTo(offsetMs: number): SVGatorPlayerInstance;
  set(property: string, value: any): SVGatorPlayerInstance;
  destruct(): SVGatorPlayerInstance;
}

interface SVGatorPlayer {
  ready(callback: (player: SVGatorPlayerInstance) => void): void;
  // 可能还有其他方法和属性声明
}

interface SVGHTMLObjectElement extends HTMLObjectElement {
  svgatorPlayer?: SVGatorPlayer;
}

export const useSvgator = ({
  el,
  iconName
}: svgatorProps): [
  { iconName: string; svgRef: RefObject<SVGHTMLObjectElement> },
  SVGatorPlayerInstance | undefined
] => {
  const svgRef = useRef<SVGHTMLObjectElement>(null);
  const [player, setPlayer] = useState<SVGatorPlayerInstance>();

  useEffect(() => {
    if (svgRef.current) {
      const svg = svgRef.current?.contentDocument?.getElementById(el);
      svg &&
        (svg as SVGHTMLObjectElement)?.svgatorPlayer?.ready(
          (p: SVGatorPlayerInstance) => {
            setPlayer(p);
          }
        );
    }
  }, [el, setPlayer]);

  return [
    {
      svgRef,
      iconName
    },
    player
  ];
};

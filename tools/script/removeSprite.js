const fs = require('fs');

function removeCommentsAndBackslashes(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');

    content = content.replace(/\\/g, '');

    fs.writeFileSync(filePath, content, 'utf-8');

    console.log(
      `Comments and backslashes removed from ${filePath} successfully.`
    );
  } catch (err) {
    console.error(`Error removing comments and backslashes: ${err}`);
  }
}

removeCommentsAndBackslashes('./public/icons/name.d.ts');

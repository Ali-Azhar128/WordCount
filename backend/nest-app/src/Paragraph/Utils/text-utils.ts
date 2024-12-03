export function splitMixedText(text: string): {
  chinese: string[];
  japanese: string[];
  english: string[];
} {
  const segments: {
    chinese: string[];
    japanese: string[];
    english: string[];
  } = {
    chinese: [],
    japanese: [],
    english: [],
  };

  let currentSegment = '';
  let currentType = 'english';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const isChineseChar = /[\u4e00-\u9fa5]/.test(char);
    const isJapaneseChar = /[\u3040-\u30ff\u31f0-\u31ff]/.test(char);

    // Determine the type of the current character
    let charType = 'english';
    if (isChineseChar) charType = 'chinese';
    else if (isJapaneseChar) charType = 'japanese';

    // If type changes or we hit a space, process the current segment
    if (charType !== currentType || char === ' ') {
      if (currentSegment) {
        if (currentType === 'chinese') segments.chinese.push(currentSegment);
        else if (currentType === 'japanese')
          segments.japanese.push(currentSegment);
        else if (currentSegment.trim())
          segments.english.push(currentSegment.trim());
      }
      currentSegment = '';
      currentType = charType;
    }

    currentSegment += char;
  }

  // Process the last segment
  if (currentSegment) {
    if (currentType === 'chinese') segments.chinese.push(currentSegment);
    else if (currentType === 'japanese') segments.japanese.push(currentSegment);
    else if (currentSegment.trim())
      segments.english.push(currentSegment.trim());
  }

  return segments;
}

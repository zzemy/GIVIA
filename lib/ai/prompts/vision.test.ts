import { buildImageRecognitionMessages, buildTextRecognitionMessages } from '@/lib/ai/prompts/vision'

describe('vision prompt builders', () => {
  it('builds text recognition messages with explicit prompt sections', () => {
    const messages = buildTextRecognitionMessages('luxury pen gift set', 'en')

    expect(messages).toHaveLength(2)
    expect(messages[0].content).toContain('## Role / Mission')
    expect(messages[0].content).toContain('## Safety Rules')
    expect(messages[0].content).toContain('## Domain Context')
    expect(messages[0].content).toContain('## Output Contract')
    expect(messages[0].content).toContain('Output JSON only with fields: label(string), description(string), confidence(number 0-1), synonyms(string[]).')
    expect(messages[1].content).toContain('Gift text: luxury pen gift set')
  })

  it('builds image recognition prompts with explicit prompt sections', () => {
    const messages = buildImageRecognitionMessages('zh')

    expect(messages.system.content).toContain('## Role / Mission')
    expect(messages.system.content).toContain('## Safety Rules')
    expect(messages.system.content).toContain('## Domain Context')
    expect(messages.system.content).toContain('## Output Contract')
    expect(messages.system.content).toContain('字段: label(string), description(string), confidence(number 0-1), synonyms(string[])。')
    expect(messages.userText).toContain('识别这张图片中的礼物对象')
  })
})

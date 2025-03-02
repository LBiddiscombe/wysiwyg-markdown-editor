import type { InlineContext, MarkdownConfig } from '@lezer/markdown';

const MarkDelim = { resolve: 'Mark', mark: 'MarkMark' }

export const Mark: MarkdownConfig = {
  defineNodes: ['Mark', 'MarkMark'],
  parseInline: [
    {
      name: 'Mark',
      parse(ctx: InlineContext, next: number, pos: number) {
        const char = ctx.char(pos + 1);
        if (next !== 61 /* '=' */ || char !== 61) {
          return -1;
        }

        return ctx.addDelimiter(MarkDelim, pos, pos + 2, true, true);
      },
    },
  ]
}
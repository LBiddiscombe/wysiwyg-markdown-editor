import { EditorView } from '@codemirror/view';

export const theme = EditorView.theme({
  '&': {
    height: '100%',
    minHeight: '100%'
  },
  '&.cm-focused': {
    outline: 'none'
  },
  '&.cm-focused .cm-selectionBackground, ::selection': {
    backgroundColor: '#11CCEE !important'
  },
  '.cm-line blockquote': {
    backgroundColor: 'transparent',
    fontStyle: 'italic',
    borderLeft: '0.25rem solid lightgray',
    padding: '0.25rem 0.5rem',
    margin: '0 0 0 0.25rem',
    display: 'inline-flex',

    '& p': {
      fontWeight: '500',
      fontSize: '0.875rem',
    }
  },
  '.cm-renderBlock p img[alt$="#100"]': { width: '100%' },
  '.cm-renderBlock p img[alt$="#75"]': { width: '75%' },
  '.cm-renderBlock p img[alt$="#67"]': { width: '67%' },
  '.cm-renderBlock p img[alt$="#50"]': { width: '50%' },
  '.cm-renderBlock p img[alt$="#33"]': { width: '33%' },
  '.cm-renderBlock p img[alt$="#25"]': { width: '25%' },
  '.cm-renderBlock p img[alt$="#10"]': { width: '10%' },
  '.cm-line.cm-codeblock': {
    backgroundColor: 'rgba(0, 0, 10, 0.7)',
    color: 'lightgreen',
    fontSize: '0.875rem',
    fontFamily: 'ui-monospace',
    lineHeight: '1.5',
    caretColor: 'white !important',
    padding: '0 0.5rem',
    margin: '0 0.25rem',

    '&.cm-codeblock-open': {
      borderRadius: '0.5rem 0.5rem 0 0',
      paddingTop: '0.5rem'
    },

    '&.cm-codeblock-close': {
      borderRadius: '0 0 0.5rem 0.5rem',
      paddingBottom: '0.5rem'
    }
  },
  '.cm-content .cm-line .cm-code': {
    backgroundColor: 'rgba(0, 0, 10, 0.7)',
    padding: '0.25rem 0',

    '&.cm-code-open': {
      borderRadius: '0.25rem 0 0 0.25rem',
      paddingLeft: '0.25rem'
    },

    '&.cm-code-close': {
      borderRadius: '0 0.25rem 0.25rem 0',
      paddingRight: '0.25rem'
    }
  },
  '.cm-content .cm-renderBlock table': {
    minWidth: 'max(40rem, 100%)',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji","Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    textAlign: 'left',
    borderCollapse: 'collapse',
    borderRadius: '0.25rem',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.12), 0 3px 10px rgba(0, 0, 0, 0.08)',

    '& thead': {
      borderBlockEnd: '1px solid whitesmoke'
    },

    '& tfoot': {
      borderBlock: '2px solid',
    },

    '& tr:hover': {
      background: 'whitesmoke'
    },

    '& th': {
      minWidth: '8rem'
    },

    '& th, & td': {
      padding: '0.5rem 0.75rem',
      borderRight: '1px solid whitesmoke'
    }
  }

})

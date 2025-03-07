import mermaid from 'mermaid'

class MermaidHelper {
  constructor() {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      flowchart: {
        curve: 'basis',
        useMaxWidth: true
      },
      deterministicIds: false,
      theme: 'neutral',
      themeVariables: {
        fontFamily: 'Shantell Sans Variable'
      },
      look: 'handDrawn'
    });
  }

  text2SVG(mermaidCode: string): HTMLDivElement {
    const sanitisedCode = this.sanitiseCode(mermaidCode);

    let containerElement = document.createElement('div');
    containerElement.className = 'border-y';

    mermaid
      .parse(sanitisedCode)
      .then(() => {
        const mermaidId = 'mermaid-svg-' + Date.now();
        mermaid
          .render(mermaidId, sanitisedCode)
          .then(({ svg, bindFunctions }) => {
            containerElement.innerHTML = svg;
            const svgElement = document.getElementById(mermaidId);
            if (svgElement) {
              svgElement.setAttribute('height', '100%');
              bindFunctions?.(svgElement);
            }
          })
      })
      .catch((error) => {
        const el = document.createElement('pre');
        el.innerHTML = `Mermaid.Parse error: ${error}`;
        el.className = 'bg-red-200 px-2 py-1 rounded text-xs';
        containerElement.appendChild(el);
      });

    return containerElement;
  }

  sanitiseCode(mermaidCode: string) {
    let sanitisedCode = mermaidCode.replace(/\n/g, '\n');
    sanitisedCode = sanitisedCode.replace(/&gt;/g, '>');
    sanitisedCode = sanitisedCode.replace(/&lt;/g, '<');

    return sanitisedCode;
  }
}

export const mermaidHelper = new MermaidHelper();
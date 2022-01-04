const head = `<head>
<meta charset="UTF-8"/>
<style>
  :root { --bg: #21252b;
          --bg-l: #282c34;
          --name: #cc7832;
          --symb: #98c379;
          --type: #6898bb;
          --comm: #abb2bf;
          --star: #ffc66d;
        }
  :root {
    // --bg: #002b36;
    // --name: #dc322f;
    // --symb: #6c71c4;
    // --type: #268bd2;
  }
  .string { color: var(--type); }
  li { line-height: 1.5em; }
  // small { color: var(--star); }
  a { text-decoration: none; border-bottom: dotted thin #93a1a1;  color: inherit; }
  a.unknown { color: red; cursor: not-allowed; }
  // a:visited { color: var(--comm); }
  body { background-color: var(--bg); color: #93a1a1; font-family: 'Ubuntu', sans-serif; }
  h2 { color: var(--comm); margin-top: 5em; }
  h1, h3 {color: var(--star)}
  p,.pp { color: var(--comm); }
  code { color: #93a1a1; font-size: 12pt; font-family: 'JetBrains Mono', monospace; }
  .code__symbol { font-weight: bold; color: var(--symb); }
  .code__annotation { background-color: var(--bg-l); color: #93a1a1; font-familly: 'Ubuntu', sans-serif;text-decoration: none;
                      font-size: .75em; border-radius: 5px; padding: 0 .25em; }
  .code__arg { font-weight: bold; color: var(--type); }
  .code__name { font-weight: bold; color: var(--name); }
  .code__keyword { font-weight: bold; color: var(--symb); }

  .group__source { background-color: var(--bg-l); border-radius: 5px; padding: .5em; }
  .group__fact { background-color: var(--bg-l); border-radius: 5px; padding: .25em; margin: .1em; }

  .rule__marker { font-familly: 'JetBrains Mono', monospace; color: var(--star); }
  .construct__documentation { width: 720px; }

  main { display: flex; flex-direction: column; justify-content: center; align-items:center; }
  #top { width: 720px; display: block; }
  footer { width: 720px; margin-top: 5em; }
  .asserts { display: flex; flex-direction: column; }
</style></head>`

const footer = `<footer><h3><span class="rule__marker">^</span><a href="#top">back to top</a></h3>ClipsDoc (C) Konrad Szychowiak 2021</footer>`;

function Description({doc})
{
  if (!doc) return '';
  return `<h3>Description</h3><div class="pp">${doc}</div>`
}

function ConstructSymbol(c)
{
  switch (c) {
    case 'TEMPLATE': return '%';
    case 'RULE': return '*';
    default: return '?';
  }
}

function Src(def, name, src) {
  return `<code class="code__keyword">(${def}</code> ` +
  `<code class="code__name"><a href="#${name}">${name}</a></code> ` +
  `${src})`
  .replace(/\".+\"/g, `<code class="string">$&</code>`)
  .replace(
    /(defrule|deftemplate|assert|read|or|and|slot)\ /g,
    `<code class="code__keyword">$&</code>`
  )    .replace(
        /(printout|allowed-values|default|type|crlf|reset|exit)/g,
        `<code class="code__keyword"><i>$&</i></code>`
      )
    .replace(/(\(|\)|\<\-)/g, `<code class="code__symbol">$&</code>`)
    .replace(/\?(?=\w)/g, `<code class="code__symbol">$&</code>`)
    .replace(/=>/g, `<br/><code class="code__symbol">$&</code> `)
}

function Source(def, name, src)
{
  return `<h3>Source code</h3><div class="group__source"><code>${Src(def, name,src)}</code></div>`;
}

function CnstAnn(constraint)
{
  switch (constraint) {
    case '?NONE': return `<ins class="code__annotation">*required</ins>`;
    case '?DERIVE': return `<ins class="code__annotation">auto</ins>`;
    case undefined: return '';
    default: return `<ins class="code__annotation">default:</ins> <code class="code__arg"><i>${constraint}</i></code>`;
  }
}

function Slot(name, {description, type, "default": constraint})
{
  return `<div>
    <code class="code__name">${name}</code>
    <ins class="code__annotation">type:</ins>
    ${type
      .split('|')
      .map(el => `<code class="code__arg">${el}</code>`)
      .join(`<code class="code__symbol">|</code>`)
      }
    ${CnstAnn(constraint)}
    <p>${description}</p>
  </div>`;
}

function IndentInRule(src)
{
  return src.replace(/=>/g, '$&')
}

function Slots(slots)
{
  if(!slots) return '';
  // return `<h3>Slots</h3><ul><li>${slots.keys().map(key => Slot(key, slots[key])).join('</li><li>')}</li></ul>`;
  return `<h3>Slots</h3><ul><li>${Object.keys(slots).map(key => Slot(key, slots[key])).join('</li><li>')}</li></ul>`;
}

function Block(info)
{
  const {identifier, display_name, src, construct, see} = info;
  const name = display_name ?? identifier;
  return `
    <h2 id="${identifier}"><span class="rule__marker">${construct}</span> ${name}</h2>
    ${Description(info)}
    ${See(see)}
  `
}

function Template(info) {
  const {identifier, display_name, src, construct, slots} = info;
  return `<div class="construct__documentation">
    ${Block(info)}
    ${Slots(slots)}
    ${Source("deftemplate",identifier,src.replace(/\(slot/g, '<br/>&nbsp;&nbsp;$&'))}
  </div>`;
}

function Rule(info)
{
  const {identifier, display_name, src, construct, slots} = info;
  return `<div class="construct__documentation">
    ${Block(info)}
    ${Source("defrule", identifier, IndentInRule(src))}
  </div>`;
}

function See(list)
{
  if (list.length == 0) return '';

  return `<h3>See also</h3><ul><li>${list
    .map(key => {
      if (known.indexOf(key) == -1) return `<a class="unknown">${key}</a> <ins class="code__annotation">(undocumented)</ins>`;
      else return `<a href="#${key}">${key}</a>`;
    })
    .map(el => `<code class="code__name">${el}</code>`)
    .join('</li><li>')}</li></ul>`;
}

const known = []

function ToC(templates, rules)
{
  const h1 = `<h1>ClipsDoc</h1>`
  const t = templates
    .map(el => `<code class="code__name"><a href="#${el.identifier}">${el.identifier}</a></code>${
      el.display_name ? `<ins class="code__annotation"> : ${el.display_name}</ins>` : ''
    }`)
    .join(', ')
    const r = rules.map(el => `<code class="code__name"><a href="#${el.identifier}">${el.identifier}</a></code>${
      el.display_name ? `<ins class="code__annotation"> : ${el.display_name}</ins>` : ''
    }`)
    .join(', ')
  // const toc = `<ol><li>${contents
  //   .map(
  //     (el) =>
  //       `<a href="#${el.rule}">${el.rule}</a>${
  //         el.summary ? ` <small>(${el.summary})</small>` : ""
  //       }`
  //   )
  //   .join("</li><li>")}</ol>`;

    return `<header id="top">
      ${h1}
      <h3>Templates</h3>
      ${t}
      <h3>Rules</h3>
      ${r}
    </header>`;
}

export function documenting(arr)
{
  const templates = []
  const rules = []

  arr.forEach(item => {
    switch (item.construct) {
      case "RULE":
        rules.push(item)
        known.push(item.identifier)
        break;
      case "TEMPLATE":
        templates.push(item)
        known.push(item.identifier)
        break;
    }
  });

  const body = `<body>
    <main>
        ${ToC(templates, rules)}
        ${templates.map(Template).join('')}
        ${rules.map(Rule).join('')}
        ${footer}
    </main>
  </body>`

  const html = `<html>${head}${body}</html>`

  return html;
}


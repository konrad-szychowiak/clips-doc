const cleaner = (el) => el.length > 0

function Rule(obj)
{
  return obj;
}

function Template(obj)
{
  const { src } = obj;
  let srcSlots = src.split(/\(slot\ /g).filter(cleaner);
  srcSlots = srcSlots.map(el => {
    const [slotID, ...more] = el.split(' ')
    let args = [];
    for (var i = 0; i < more.length; i++) {
      let a = []
      if (more[i][0] == '(') {
        a.push(more[i])
        while(more[i][more[i].length-1] !== ')')
      {
        i++;
        a.push(more[i])
      }}
      args.push(a.join(' ').replace(/[\(\)]/g, ''))
    }
    return ({slotID, args})
  })
  .map(({slotID, args}) => {
    const type = [];
    let defa = "";
    args.forEach(arg => {
      const [token, ...rest] = arg.split(' ')
      switch (token) {
        case 'allowed-values':
          rest.forEach(r => type.push(r))
          break;
        case 'type':
          type.push(rest[0])
          break;
        case 'default':
          defa = rest.join(' ')
          break;
      }
    })
    return ({ slotID, type: type.join('|'), default: defa})
  })
  let slots = obj.slots
  srcSlots.forEach((e) => {
    Object.assign(slots[e.slotID], {type: e.type})
    Object.assign(slots[e.slotID], {default: e.default})
  })
  return {...obj, slots};
}

function field(src)
{
  const [token, ...rawArgs] = src.split(' ')
  const args = rawArgs.filter(cleaner)
  if(cleaner(args)) return ({ token, args })
}

function i_construct_type(token, args)
{
  return ({ construct_type: token, name: args[0] })
}

function interpret_field(src)
{
  const f = field(src);
  if(!f) return;

  const {token, args} = f;
  return f;
}

function interpret_construct(c)
{
  switch (c.construct) {
    case 'RULE':
      return Rule(c);
    case 'TEMPLATE':
      return Template(c);
  }
}

function construct(src)
{
  const fields = src.split('\n').filter(el => el !== undefined).filter(cleaner).map(interpret_field).filter(el => el !== undefined)
  if (!cleaner(fields)) return ;
  let construct = { slots: {}, see: [] }
  fields.forEach(el => {
    const {token, args} = el;
    if (token == 'RULE' || token == 'TEMPLATE') {
      construct = {...construct, construct: token, identifier: args[0]}
      return;
    }
    if (token == 'SLOT_REF') {
      const [slotID, ...desc]  = args;
      construct.slots[slotID] = { description: desc.join(' ') }
      return;
    }
    if (token == 'SEE') {
      construct.see.push(args[0])
      return;
    }
    construct = {...construct, [token.toLowerCase()]: args.join(' ')}
  })
  return interpret_construct(construct);
}

export function interpreter(src)
{
  const cleaned = src.replace(/\ +/g, ' ');
  const constructs = cleaned.split(';');
  return constructs
    .map(construct)
    .filter(el => el !== undefined)
}

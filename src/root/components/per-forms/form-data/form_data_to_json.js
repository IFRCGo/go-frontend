const fs = require('fs');

const forms = [
  'a1',
  'a2',
  'a3',
  'a3-2',
  'a4',
  'a5'
];

const data = {};

forms.forEach(f => {

  // This is terrible code.
  // Converts the js files into JSON data that can be read into a variable
  const txt = fs.readFileSync(`./${f}/english-data.js`, 'utf-8');
  const json = txt.trim().replace('export const englishForm = ', '').slice(0, -1);
  eval(`data[f] = ${json}`);
});

const output = {};

forms.forEach(form => {
  const components = data[form].components;
  components.forEach((comp, compIdx) => {
    if (comp.namespaces) {
      comp.namespaces.forEach((ns, nsIdx) => {
        const qid = `${form}c${compIdx}q${nsIdx}`;
        output[qid] = ns.nsTitle;
      });
    }
  });  
});

console.log(JSON.stringify(output, null, 2));
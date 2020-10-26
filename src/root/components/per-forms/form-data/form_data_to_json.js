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
  const engtxt = fs.readFileSync(`./${f}/english-data.js`, 'utf-8');
  const frtxt = fs.readFileSync(`./${f}/french-data.js`, 'utf-8');
  const estxt = fs.readFileSync(`./${f}/spanish-data.js`, 'utf-8');
  const json = `{
    english: ${engtxt.trim().replace('export const englishForm = ', '').slice(0, -1)},
    french: ${frtxt.trim().replace('export const frenchForm = ', '').slice(0, -1)},
    spanish: ${estxt.trim().replace('export const spanishForm = ', '').slice(0, -1)}
  }`;
  eval(`data[f] = ${json}`);
});

// forms.forEach(form => {
//   const components = data[form].components;
//   components.forEach((comp, compIdx) => {
//     if (comp.namespaces) {
//       comp.namespaces.forEach((ns, nsIdx) => {
//         const qid = `${form}c${compIdx}q${nsIdx}`;
//         output[qid] = ns.nsTitle;
//       });
//     }
//   });
// });


// --- VERY VERY VERY BAD CODE, JUST NEEDED THIS TO WORK HOWEVER... ---
let arrDict = {
  'a1': [],
  'a2': [],
  'a3': [],
  'a3-2': [],
  'a4': [],
  'a5': []
}

// --- COMPONENTS - TITLES
forms.forEach(form => {
  const engComponents = data[form]['english'].components;
  const frComponents = data[form]['french'].components;
  const esComponents = data[form]['spanish'].components;

  let prevNumberLetter = '';

  engComponents.forEach((comp, compIdx) => {
    const compTitle = comp.componentTitle.replace(/.*Component.*(\.|\:) /, '') || '';
    let compNumberLetter = comp.componentTitle.match(/.*Component \d../)
      ? comp.componentTitle.match(/.*Component(\:|\s)*\d../)[0]
        .replace(/Component\s/, '')
        .replace(' ', '')
        .replace('.', '')
        .replace(':', '')
        .replace('Sub-', '')
      : '';
    if (!compNumberLetter) {
      compNumberLetter = prevNumberLetter;
    } else {
      prevNumberLetter = compNumberLetter;
    }

    arrDict[form].push([compNumberLetter, compTitle]);
  });

  frComponents.forEach((comp, compIdx) => {
    const compTitle = comp.componentTitle.replace(/.*Catégorie.*(\.|\:) /, '');
    arrDict[form][compIdx].push(compTitle);
  });

  esComponents.forEach((comp, compIdx) => {
    const compTitle = comp.componentTitle ? comp.componentTitle.replace(/.*Componente.*(\.|\:) /, '') : '';
    arrDict[form][compIdx].push(compTitle);
    arrDict[form][compIdx].push(''); // push empty for arabic
  });
});

// --- COMPONENTS - DESCRIPTIONS
forms.forEach(form => {
  const engComponents = data[form]['english'].components;
  const frComponents = data[form]['french'].components;
  const esComponents = data[form]['spanish'].components;

  engComponents.forEach((comp, compIdx) => {
    arrDict[form][compIdx].push(comp.componentDescription || '');
  });

  frComponents.forEach((comp, compIdx) => {
    arrDict[form][compIdx].push(comp.componentDescription || '');
  });

  esComponents.forEach((comp, compIdx) => {
    arrDict[form][compIdx].push(comp.componentDescription || '');
    arrDict[form][compIdx].push(''); // push empty for arabic
  });
});

// --- CONSTRUCT THE CSV OUTPUT
forms.forEach(form => {
  let output = 'component_num,title,title_fr,title_es,title_ar,description,description_fr,description_es,description_ar\n';

  arrDict[form].forEach(comp => {
    const lastindex = comp.length - 1;

    comp.forEach((str, idx) => {
      if (idx === lastindex) {
        output += `"${str}"\n`;
      } else {
        output += `"${str}",`;
      }
    });
  });

  fs.writeFile(`components_${form}.csv`, output, function (err) {
    if (err) throw err;
    console.log(`components_${form}.csv Saved!`);
  });
});



// --- QUESTIONS
arrDict = {
  'a1': [],
  'a2': [],
  'a3': [],
  'a3-2': [],
  'a4': [],
  'a5': []
}

// --- QUESTSIONS - TITLES
forms.forEach(form => {
  const engComponents = data[form]['english'].components;
  const frComponents = data[form]['french'].components;
  const esComponents = data[form]['spanish'].components;

  engComponents.forEach((comp, compIdx) => {
    if (comp.namespaces) {
      comp.namespaces.forEach((q, nidx) => {
        const qTitle = q.nsTitle.replace(/\d*\.\d* /, '') || '';
        const wholeQnum = q.nsTitle.match(/\d*\.\d* /)
        ? q.nsTitle.match(/\d*\.\d* /)[0]
          .replace(' ', '')
        : '';
        const compNumber = wholeQnum
          .replace(/\.\d*/, '');
        const qNumber = wholeQnum
          .replace(/\d*\./, '')
          .replace('.', '');

        arrDict[form].push([compNumber, qNumber, qTitle]);
      });
    }
  });

  let counter = 0;
  frComponents.forEach((comp, compIdx) => {
    if (comp.namespaces) {
      comp.namespaces.forEach((q, nidx) => {
        const qTitle = q.nsTitle.replace(/\d*\.\d* /, '') || '';
        arrDict[form][counter].push(qTitle);
        counter++;
      });
    }
  });

  counter = 0;
  esComponents.forEach((comp, compIdx) => {
    if (comp.namespaces) {
      comp.namespaces.forEach((q, nidx) => {
        const qTitle = q.nsTitle.replace(/\d*\.\d* /, '') || '';
        arrDict[form][counter].push(qTitle);
        arrDict[form][counter].push(''); // push empty for arabic
        counter++;
      });
    }
  });
});

// --- CONSTRUCT THE CSV OUTPUT
forms.forEach(form => {
  let output = 'component_num,question_num,question,question_fr,question_es,question_ar\n';

  arrDict[form].forEach(comp => {
    const lastindex = comp.length - 1;

    comp.forEach((str, idx) => {
      if (idx === lastindex) {
        output += `"${str}"\n`;
      } else {
        output += `"${str}",`;
      }
    });
  });

  fs.writeFile(`questions_${form}.csv`, output, function (err) {
    if (err) throw err;
    console.log(`questions_${form}.csv Saved!`);
  });
});

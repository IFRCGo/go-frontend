import React from 'react';
import { PropTypes as T } from 'prop-types';
import { environment } from '#config';
import Fold from './fold';
import {
  commaSeparatedNumber as n,
  separateUppercaseWords as separate
} from '#utils/format';
import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

class _KeyFigures extends React.Component {
  render () {
    const { strings } = this.context;
    const { fetching, fetched, error, data } = this.props.data;
    if (fetching || error || (fetched && !data.results.length)) return null;
    return (
      <Fold id='key-figures' title={strings.keyFiguresTitle} foldWrapperClass='key-figures'>
        <ul className='key-figures-list'>
          {data.results.map(o => (
            <li key={o.deck}>
              <h3>{isNaN(o.figure) ? o.figure : n(o.figure)}</h3>
              <p className='key-figure-label'>{o.deck}</p>
              <p className='key-figure-source'>Source: {o.source}</p>
            </li>
          ))}
        </ul>
      </Fold>
    );
  }
}

_KeyFigures.contextType = LanguageContext;

class _Contacts extends React.Component {
  render () {
    const { data } = this.props;
    const { strings }  = this.context;
    if (data.contacts && !data.contacts.length) return null;
    return (
      <Fold id='contacts' title={strings.contactsTitle} foldWrapperClass='contacts' foldTitleClass='margin-reset'>
        <table className='table table--contacts'>
          <thead className='visually-hidden'>
            <tr>
              <th><Translate stringId='contactsHeaderName'/></th>
              <th><Translate stringId='contactsHeaderTitle'/></th>
              <th><Translate stringId='contactsHeaderType'/></th>
              <th><Translate stringId='contactsHeaderContact'/></th>
            </tr>
          </thead>
          <tbody>
            {data.contacts.map(o => (
              <tr key={o.id}>
                <td>{o.name}</td>
                <td>{o.title}</td>
                <td>{separate(o.ctype)}</td>
                <td>{o.email.indexOf('@') !== -1
                     ? <a className='link--table' href={`mailto:${o.email}`} title={strings.contactsEmailTitle}>{o.email}</a>
                     : <a className='link--table' href={`tel:${o.email}`} title={strings.contactsEmailTitle}>{o.email}</a>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Fold>
    );
  }
}
_Contacts.contextType = LanguageContext;

class _Snippets extends React.Component {
  render () {
    const { strings } = this.context;
    const { fetching, fetched, error, data } = this.props.data;
    if (fetching || error || (fetched && !data.results.length)) return null;
    return (
      <Fold id='graphics' title={strings.snippetsTitle} foldWrapperClass='additional-graphics'>
        <div className='iframe__container'>
          {data.results.map(o => o.snippet ? <div className='snippet__item' key={o.id} dangerouslySetInnerHTML={{__html: o.snippet}} />
            : o.image ? <div key={o.id} className='snippet__item snippet__image'><img src={o.image}/></div> : null
          )}
        </div>
      </Fold>
    );
  }
}
_Snippets.contextType = LanguageContext;

class _TitledSnippets extends React.Component {
  render () {
    const { snippets } = this.props;
    if (snippets.length === 0) {
      return null;
    }
    return snippets.map(snippet => (
      <Fold title={snippet.title} foldWrapperClass='additional-graphics' key={snippet.id}> 
        <div className='iframe__container'>
          <div className='snippet_item' key={snippet.id} dangerouslySetInnerHTML={{__html: snippet.snippet}} />
        </div>
      </Fold>      
    ));
  }
}
_TitledSnippets.contextType = LanguageContext;

class _Links extends React.Component {
  render () {
    const { strings } = this.context;
    const { data } = this.props;
    if (data.links && !data.links.length) return null;
    return (
      <Fold id='links' title={strings.linksTitle} foldWrapperClass='links' foldTitleClass='margin-reset'>
        <ul className='links-list row'>
          {
            data.links.map(function (o) {
              // If data.links[i] has property show_in_go, then turn it into a link that will
              // send the object data back to the parent
              if ('onClick' in o) {
                return <li key={o.id} onClick={() => o.onClick(o)} className='col'><a>{o.title}
                  <span className='collecticon-chevron-right icon-links-list'></span>
                </a></li>;
              } else {
                return <li key={o.id} className='col'><a href={o.url}>{o.title}
                  <span className='collecticon-arrow-right-diagonal icon-links-list'></span>
                </a></li>;
              }
            })
          }
          <li className='links-list-design links-list-design--1' aria-hidden='true'></li>
          <li className='links-list-design links-list-design--2' aria-hidden='true'></li>
        </ul>
      </Fold>
    );
  }
}
_Links.contextType = LanguageContext;

if (environment !== 'production') {
  _KeyFigures.propTypes = { data: T.object };
  _Contacts.propTypes = { data: T.object };
  _Links.propTypes = { data: T.object };
  _Snippets.propTypes = { data: T.object };
  _TitledSnippets.propTypes = { snippets: T.array };
}

export const KeyFigures = _KeyFigures;
export const Contacts = _Contacts;
export const Links = _Links;
export const Snippets = _Snippets;
export const TitledSnippets = _TitledSnippets;

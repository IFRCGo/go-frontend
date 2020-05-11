import React from 'react';
import { PropTypes as T } from 'prop-types';
import { environment } from '../config';
import Fold from './fold';
import {
  commaSeparatedNumber as n,
  separateUppercaseWords as separate
} from '../utils/format';

class _KeyFigures extends React.Component {
  render () {
    const { fetching, fetched, error, data } = this.props.data;
    if (fetching || error || (fetched && !data.results.length)) return null;
    return (
      <Fold id='key-figures' title='Key Figures' wrapper_class='key-figures'>
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

class _Contacts extends React.Component {
  render () {
    const { data } = this.props;
    if (data.contacts && !data.contacts.length) return null;
    return (
      <Fold id='contacts' title='Contacts' wrapperClass='contacts' foldClass='margin-reset'>
        <table className='table'>
          <thead className='visually-hidden'>
            <tr>
              <th>Name</th>
              <th>Title</th>
              <th>Type</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {data.contacts.map(o => (
              <tr key={o.id}>
                <td>{o.name}</td>
                <td>{o.title}</td>
                <td>{separate(o.ctype)}</td>
                <td>{o.email.indexOf('@') !== -1
                  ? <a className='link--primary' href={`mailto:${o.email}`} title='Contact'>{o.email}</a>
                  : <a className='link--primary' href={`tel:${o.email}`} title='Contact'>{o.email}</a>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Fold>
    );
  }
}

class _Snippets extends React.Component {
  render () {
    const { fetching, fetched, error, data } = this.props.data;
    if (fetching || error || (fetched && !data.results.length)) return null;
    return (
      <Fold id='graphics' title='Additional Graphics' wrapper_class='additional-graphics'>
        <div className='iframe__container'>
          {data.results.map(o => o.snippet ? <div className='snippet__item' key={o.id} dangerouslySetInnerHTML={{__html: o.snippet}} />
            : o.image ? <div key={o.id} className='snippet__item snippet__image'><img src={o.image}/></div> : null
          )}
        </div>
      </Fold>
    );
  }
}

class _Links extends React.Component {
  render () {
    const { data } = this.props;
    if (data.links && !data.links.length) return null;
    return (
      <Fold id='links' title='Additional Links' wrapper_class='links' foldClass='margin-reset'>
        <ul className='links-list'>
          {data.links.map(o => <li key={o.id}><a href={o.url} className='link--external'>{o.title}</a> </li>)}
        </ul>
      </Fold>
    );
  }
}

if (environment !== 'production') {
  _KeyFigures.propTypes = { data: T.object };
  _Contacts.propTypes = { data: T.object };
  _Links.propTypes = { data: T.object };
  _Snippets.propTypes = { data: T.object };
}

export const KeyFigures = _KeyFigures;
export const Contacts = _Contacts;
export const Links = _Links;
export const Snippets = _Snippets;

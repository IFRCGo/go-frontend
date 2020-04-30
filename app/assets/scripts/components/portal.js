import ReactDOM from 'react-dom';

function Portal (props) {
  const { children } = props;
  return (
    ReactDOM.createPortal(
      children,
      document.body,
    )
  );
}

export default Portal;

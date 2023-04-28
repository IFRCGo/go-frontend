import React from 'react';
import ReactDOM from 'react-dom';

interface Props {
    children: React.ReactNode;
}

function Portal(props: Props) {
    const { children } = props;
    return (
        ReactDOM.createPortal(
            children,
            document.body,
        )
    );
}

export default Portal;

import React, { useCallback, useState } from 'react';
import Links from './examples/Links';
import Buttons from './examples/Buttons';
import styles from './styles.module.scss';
import Cards from './examples/Cards';
import Alerts from './examples/Alerts';
import OverlayExample from './examples/OverlayExample';
import Headings from './examples/Headings';
import Button from './components/Button';
import DropdownExample from './examples/DropdownExample';

function GoUI() {

  const [element, setElement] = useState<string | undefined>("links");

  const handleNewComponent = useCallback((name) => {
    setElement(name);
  }, [setElement]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.sideContent}>
        <Button
          name="links"
          className={styles.option}
          onClick={handleNewComponent}
        >
          Links
        </Button>
        <Button
          name="buttons"
          className={styles.option}
          onClick={handleNewComponent}
        >
          Buttons
        </Button>
        <Button
          name="headings"
          className={styles.option}
          onClick={handleNewComponent}
        >
          Headings
        </Button>
        <Button
          name="dropdown"
          className={styles.option}
          onClick={handleNewComponent}
        >
          Dropdown
        </Button>
        <Button
          name="cards"
          className={styles.option}
          onClick={handleNewComponent}
        >
          Cards
        </Button>
        <Button
          name="alerts"
          className={styles.option}
          onClick={handleNewComponent}
        >
          Alerts
        </Button>
        <Button
          name="overlay"
          className={styles.option}
          onClick={handleNewComponent}
        >
          Overlay
        </Button>
      </div>
      <div className={styles.componentLayout}>
        {element === "links" && <Links />}
        {element === "cards" && <Cards />}
        {element === "alerts" && <Alerts />}
        {element === "overlay" && <OverlayExample />}
        {element === "buttons" && <Buttons />}
        {element === "headings" && <Headings />}
        {element === "dropdown" && <DropdownExample />}
      </div >
    </div >
  );
}

export default GoUI;

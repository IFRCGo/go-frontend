import React, { useCallback, useState } from 'react';
import Links from './examples/Links';
import Buttons from './examples/Buttons';
import styles from './styles.module.scss';
import Cards from './examples/Cards';
import Alerts from './examples/Alerts';
import OverlayExample from './examples/OverlayExample';
import Modals from './examples/Modals';
import Headings from './examples/Headings';
import Button from './components/Button';
import DropdownExample from './examples/DropdownExample';
import IconButtons from './examples/IconButtons';
import Navigation from './examples/Navigation';
import RawTextAreaExample from './examples/RawTextExample';
import TextAreaExample from './examples/TextAreaExample';
import TextInputExample from './examples/TextInputExample';
import SwitchExample from './examples/SwitchExample';
import CheckboxExample from './examples/CheckboxExample';
import DateInputExample from './examples/DateInputExample';
import NumberInputExample from './examples/NumberInputExample';
import RichTextAreaExample from './examples/RichTextAreaExample';
import RadioInputExample from './examples/RadioInputExample';
import BlockLoadingExample from './examples/BlockLoadingExample';
import BreadcrumbsExample from './examples/BreadcrumbsExample';
import PasswordInputExample from './examples/PasswordInputExample';
import ChecklistExample from './examples/ChecklistExample';

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
          name="raw-text-area"
          className={styles.option}
          onClick={handleNewComponent}
        >
          Raw Text Area
        </Button>
        <Button
          name="text-area"
          className={styles.option}
          onClick={handleNewComponent}
        >
          Text Area
        </Button>
        <Button
          name="text-input"
          className={styles.option}
          onClick={handleNewComponent}
        >
          Text Input
        </Button>
        <Button
          name="date-input"
          className={styles.option}
          onClick={handleNewComponent}
        >
          DateInput
        </Button>
        <Button
          name="rich-text-area"
          className={styles.option}
          onClick={handleNewComponent}
        >
          RichTextArea
        </Button>
        <Button
          name="switch"
          className={styles.option}
          onClick={handleNewComponent}
        >
          Switch
        </Button>
        <Button
          name="checkbox"
          className={styles.option}
          onClick={handleNewComponent}
        >
          Check Box
        </Button>
        <Button
          name="number-input"
          className={styles.option}
          onClick={handleNewComponent}
        >
          Number Input
        </Button>
        <Button
          name="radio-input"
          className={styles.option}
          onClick={handleNewComponent}
        >
          RadioInput
        </Button>
        <Button
          name="password-input"
          className={styles.option}
          onClick={handleNewComponent}
        >
          PasswordInput
        </Button>
        <Button
          name="checklist"
          className={styles.option}
          onClick={handleNewComponent}
        >
          Checklist
        </Button>
        <Button
          name="block-loading"
          className={styles.option}
          onClick={handleNewComponent}
        >
          BlockLoading
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
        <Button
          name="tabs"
          className={styles.option}
          onClick={handleNewComponent}
        >
          Tab Panel
        </Button>
        <Button
          name="modals"
          className={styles.option}
          onClick={handleNewComponent}
        >
          Modal
        </Button>
        <Button
          name="iconButton"
          className={styles.option}
          onClick={handleNewComponent}
        >
          IconButton
        </Button>
        <Button
          name="breadcrumbs"
          className={styles.option}
          onClick={handleNewComponent}
        >
          Breadcrumbs
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
        {element === "tabs" && <Navigation />}
        {element === 'modals' && <Modals />}
        {element === "raw-text-area" && <RawTextAreaExample />}
        {element === "text-area" && <TextAreaExample />}
        {element === "text-input" && <TextInputExample />}
        {element === "switch" && <SwitchExample />}
        {element === "checkbox" && <CheckboxExample />}
        {element === 'iconButton' && <IconButtons />}
        {element === "number-input" && <NumberInputExample />}
        {element === "date-input" && <DateInputExample />}
        {element === "rich-text-area" && <RichTextAreaExample />}
        {element === "radio-input" && <RadioInputExample />}
        {element === "block-loading" && <BlockLoadingExample />}
        {element === "breadcrumbs" && <BreadcrumbsExample />}
        {element === "password-input" && <PasswordInputExample />}
        {element === "checklist" && <ChecklistExample />}
      </div >
    </div >
  );
}

export default GoUI;

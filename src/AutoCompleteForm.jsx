import {
  useState, useRef, useLayoutEffect, React,
} from 'react';
import PropTypes from 'prop-types';

// Valid suggestions will appear in the same order as they do in the array `suggestions`.
// `handleSubmit` is a callback func where the input will be passed to when form is submitted.
// `synonyms` is an obj where keys are from `suggestions` and values are a list of synonyms.
// If user input is a prefix of a synonym or a suggestion,
//   the suggestion will appear below the input box.
// `descriptions` is an obj where keys are from `suggestions` and values are a
//   subtitle to be shown under the suggestion
// Assumes suggestions/synonyms have no punctuation/digits for simplicity,
//   modify regex in `cleanInput` if otherwise.
// Some code used from https://blog.logrocket.com/build-react-autocomplete-component/
function AutoCompleteForm({
  suggestions, handleSubmit, synonyms, descriptions,
}) {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [input, setInput] = useState('');
  const submitButton = useRef(null);
  const activeSuggestionRef = useRef(null);

  // Remove any punctuation, digits i.e. U.S.A. => USA; and lowercase/trim
  const cleanInput = (str) => str.replace(/[^A-Za-z\s]/g, '').toLowerCase().trim();

  const onChange = (e) => {
    const userInput = (e.target.value || '');
    const userInputClean = cleanInput(userInput);

    // Filter our suggestions that don't contain the user's input
    const unLinked = suggestions.filter((suggestion) => (
      (suggestion.toLowerCase().indexOf(userInputClean) > -1)
        || (synonyms
          && synonyms[suggestion]
          && synonyms[suggestion]
            .some((synonym) => synonym.toLowerCase().indexOf(userInputClean) > -1))
    ));

    setInput(e.target.value);
    setFilteredSuggestions(unLinked);
    setActiveSuggestionIndex(0);
    setShowSuggestions(true);
  };

  const focusOnSubmit = () => {
    submitButton.current.focus();
  };

  const onClick = (e) => {
    setFilteredSuggestions([]);
    setInput(e.currentTarget.firstChild.nodeValue);
    setActiveSuggestionIndex(0);
    setShowSuggestions(false);
    focusOnSubmit();
  };

  const onKeyDown = (key) => {
    if ((key.code === 'Enter' || key.code === 'Tab' || key.code === 'ArrowRight') && filteredSuggestions.length > 0) {
      key.preventDefault();
      setInput(filteredSuggestions[activeSuggestionIndex]);
      setFilteredSuggestions([]);
      setActiveSuggestionIndex(0);
      setShowSuggestions(false);
      focusOnSubmit();
    } else if (key.code === 'ArrowUp') {
      if (activeSuggestionIndex === 0) {
        key.preventDefault();
        setActiveSuggestionIndex(filteredSuggestions.length - 1);
      } else {
        key.preventDefault();
        setActiveSuggestionIndex(activeSuggestionIndex - 1);
      }
    } else if (key.code === 'ArrowDown') {
      key.preventDefault();
      setActiveSuggestionIndex((activeSuggestionIndex + 1) % filteredSuggestions.length);
    }
  };

  // Scroll to active suggestion when it changes (i.e. when `activeSuggestionIndex` is modified)
  useLayoutEffect(() => {
    activeSuggestionRef.current?.scrollIntoView({ behaviour: 'smooth', block: 'nearest' });
  }, [activeSuggestionIndex]);

  const onSubmit = (e) => {
    const countryInput = e.target[0].value;
    const guess = suggestions
      .find((x) => x.toLowerCase().trim() === countryInput.toLowerCase().trim());

    if (guess) {
      handleSubmit(guess);
      setInput('');
    }

    e.preventDefault();
  };

  return (
    <form className="Main-form" autoComplete="off" onSubmit={onSubmit}>
      <input
        className="Main-input"
        type="text"
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={input}
        placeholder="Which country?"
      />
      <input
        className="Main-submit"
        type="submit"
        value="Submit"
        ref={submitButton}
      />
      {showSuggestions
      && input
      && (
        <SuggestionsListComponent
          filteredSuggestions={filteredSuggestions}
          activeSuggestionIndex={activeSuggestionIndex}
          activeSuggestionRef={activeSuggestionRef}
          descriptions={descriptions}
          onClick={onClick}
        />
      )}
    </form>
  );
}

AutoCompleteForm.propTypes = {
  suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  synonyms: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  descriptions: PropTypes.objectOf(PropTypes.string).isRequired,
};

function SuggestionsListComponent({
  filteredSuggestions, activeSuggestionIndex, activeSuggestionRef, descriptions, onClick,
}) {
  const invalidInput = filteredSuggestions.length;

  return invalidInput ? (
    <ul className="suggestions">
      {filteredSuggestions.map((suggestion, index) => {
        let className;
        const descriptionClassName = 'suggestion-description';
        let ref = null;

        // Flag the active suggestion with a class
        if (index === activeSuggestionIndex) {
          className = 'suggestion-active';
          ref = activeSuggestionRef;
        }

        return (
        // Reasoning: Key events are in parent form,
        // click event required for this element bc of hitbox
          /*
            eslint-disable-next-line
            jsx-a11y/no-noninteractive-element-interactions,
            jsx-a11y/click-events-have-key-events
          */
          <li className={className} key={suggestion} onClick={onClick} ref={ref}>
            {suggestion}
            {descriptions && descriptions[suggestion]
            && (<span className={descriptionClassName}>{descriptions[suggestion]}</span>)}
          </li>
        );
      })}
    </ul>
  ) : (
    <div className="no-suggestions">
      <em>Only the top 100 most populated countries are in this game!</em>
    </div>
  );
}

// PropType for react `ref`s, from https://stackoverflow.com/a/56950157
const refPropType = PropTypes.oneOfType([
  PropTypes.func,
  PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
]);

SuggestionsListComponent.propTypes = {
  filteredSuggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeSuggestionIndex: PropTypes.number.isRequired,
  activeSuggestionRef: refPropType.isRequired,
  descriptions: PropTypes.objectOf(PropTypes.string).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default AutoCompleteForm;

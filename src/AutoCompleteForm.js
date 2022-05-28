import { useState, useRef, useLayoutEffect } from 'react';

// Valid suggestions will appear in the same order as they do in the array `suggestions`
// `synonyms` is an obj where keys are suggestions that have a synonym and the value is an array of said synonyms.
// If user input is a prefix of a synonym or a suggestion, the suggestion will appear below the input box
// Assumes suggestions/synonyms have no punctuation/digits to save some time, remove the `userInputStripped` removal of puncuation if this is the case
// Some code used from https://blog.logrocket.com/build-react-autocomplete-component/
function AutoCompleteForm({ suggestions, handleSubmit, synonyms, descriptions }) {
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [input, setInput] = useState("");
    const submitButton = useRef(null);
    const activeSuggestionRef = useRef(null);

    const onChange = (e) => {
      const userInput = (e.target.value || "");
      const userInputClean = cleanInput(userInput);

      // Filter our suggestions that don't contain the user's input
      const unLinked = suggestions.filter(suggestion => {
          return (
            (suggestion.toLowerCase().indexOf(userInputClean) > -1) ||
            (
              synonyms &&
              synonyms[suggestion] &&
              synonyms[suggestion].some(synonym => synonym.toLowerCase().indexOf(userInputClean) > -1)
            )
          );
        }
      );
  
      setInput(e.target.value);
      setFilteredSuggestions(unLinked);
      setActiveSuggestionIndex(0);
      setShowSuggestions(true);
    }

    // Remove any punctuation, digits i.e. U.S.A. => USA; and lowercase/trim
    const cleanInput = input => input.replace(/[^A-Za-z\s]/g, "").toLowerCase().trim();

    const onClick = (e) => {
        setFilteredSuggestions([]);
        setInput(e.currentTarget.firstChild.nodeValue);
        setActiveSuggestionIndex(0);
        setShowSuggestions(false);
        focusOnSubmit();
    }

    const onKeyDown = (key) => {
      if ((key.code === "Enter" || key.code === "Tab" || key.code === "ArrowRight") && filteredSuggestions.length > 0) {
        key.preventDefault();
        setInput(filteredSuggestions[activeSuggestionIndex]);
        setFilteredSuggestions([]);
        setActiveSuggestionIndex(0);
        setShowSuggestions(false);
        focusOnSubmit();
      } else if (key.code === "ArrowUp") {
        if (activeSuggestionIndex === 0) {
          key.preventDefault();
          setActiveSuggestionIndex(filteredSuggestions.length - 1);
        } else {
          key.preventDefault();
          setActiveSuggestionIndex(activeSuggestionIndex - 1);
        }
      } else if (key.code === "ArrowDown") {
        key.preventDefault();
        setActiveSuggestionIndex((activeSuggestionIndex + 1) % filteredSuggestions.length);
      }
    }

    useLayoutEffect(() => {
      activeSuggestionRef.current?.scrollIntoView({ behaviour: "smooth", block: "nearest" });
    }, [activeSuggestionIndex]);

    
    const onSubmit = (e) => {
      const countryInput = e.target[0].value;
      const guess = suggestions.find(x => x.toLowerCase().trim() === countryInput.toLowerCase().trim());

      if (guess) {
        handleSubmit(guess);
        setInput("");
      }

      e.preventDefault();
    }

    const focusOnSubmit = () => {
      submitButton.current.focus();
    }

    const SuggestionsListComponent = () => {
      const invalidInput = filteredSuggestions.length;
      return invalidInput ? (
        <ul className="suggestions">
          {filteredSuggestions.map((suggestion, index) => {
            let className;
            let descriptionClassName = "suggestion-description";
            let ref = null;

            // Flag the active suggestion with a class
            if (index === activeSuggestionIndex) {
              className = "suggestion-active";
              ref = activeSuggestionRef;
            }

            return (
              <li className={className} key={suggestion} onClick={onClick} ref={ref}>
                {suggestion}
                {descriptions && descriptions[suggestion] && (<span className={descriptionClassName}>{descriptions[suggestion]}</span>)}
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
        {showSuggestions && input && <SuggestionsListComponent />}
      </form>
    );
 }

 export default AutoCompleteForm;
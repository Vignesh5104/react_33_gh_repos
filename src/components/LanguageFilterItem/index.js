// Write your code here
import './index.css'

const LanguageFilterItem = props => {
  const {languageItem, isActive, updateActiveTab} = props
  const {id, language} = languageItem

  const ActiveTabStyle = isActive
    ? 'language-active-tab-item'
    : 'language-tab-item'

  const onClickLanguageTab = () => {
    updateActiveTab(id)
  }

  return (
    <button
      className="language-button"
      type="button"
      onClick={onClickLanguageTab}
    >
      <li className={ActiveTabStyle}>{language}</li>
    </button>
  )
}

export default LanguageFilterItem

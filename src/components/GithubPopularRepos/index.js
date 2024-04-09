import {Component} from 'react'
import Loader from 'react-loader-spinner'
import LanguageFilterItem from '../LanguageFilterItem'
import RepositoryItem from '../RepositoryItem'

import './index.css'

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

// Write your code here

class GithubPopularRepos extends Component {
  state = {
    repositoryList: [],
    activeTabId: languageFiltersData[0].id,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getRequestGithubRepos()
  }

  updateActiveTab = id => {
    this.setState({activeTabId: id}, this.getRequestGithubRepos)
  }

  getRequestGithubRepos = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {activeTabId} = this.state
    const url = `https://apis.ccbp.in/popular-repos?language=${activeTabId}`

    const response = await fetch(url)
    const data = await response.json()

    if (response.ok === true) {
      const updatedData = data.popular_repos.map(eachRepos => ({
        name: eachRepos.name,
        id: eachRepos.id,
        issuesCount: eachRepos.issues_count,
        forksCount: eachRepos.forks_count,
        starsCount: eachRepos.stars_count,
        avatarUrl: eachRepos.avatar_url,
      }))

      this.setState({
        repositoryList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else if (response.status === 401) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLanguageFiltersList = () => {
    const {activeTabId} = this.state

    return (
      <ul className="language-tab-list-route-container">
        {languageFiltersData.map(each => (
          <LanguageFilterItem
            isActive={activeTabId === each.id}
            updateActiveTab={this.updateActiveTab}
            languageItem={each}
            key={each.id}
          />
        ))}
      </ul>
    )
  }

  renderInProgressView = () => (
    <div data-testid="loader" className="loading-screen-container">
      <Loader type="ThreeDots" color="#0284c7" height={80} width={80} />
    </div>
  )

  renderRepositoryListView = () => {
    const {repositoryList} = this.state
    return (
      <ul className="repository-items-route-container">
        {repositoryList.map(eachRepos => (
          <RepositoryItem ReposDetails={eachRepos} key={eachRepos.id} />
        ))}
      </ul>
    )
  }

  renderApiFailureView = () => (
    <div className="failure-view-container">
      <img
        className="failure-view-image"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1 className="error-massage">Something Went Wrong</h1>
    </div>
  )

  renderInProgressView = () => (
    <div data-testid="loader" className="loading-screen-container">
      <Loader type="ThreeDots" color="#0284c7" height={80} width={80} />
    </div>
  )

  renderRepositories = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderRepositoryListView()
      case apiStatusConstants.failure:
        return this.renderApiFailureView()
      case apiStatusConstants.inProgress:
        return this.renderInProgressView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="github-popular-repository-route-container">
        <h1 className="main-heading">Popular</h1>
        {this.renderLanguageFiltersList()}
        {this.renderRepositories()}
      </div>
    )
  }
}

export default GithubPopularRepos

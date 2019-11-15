import { connect } from 'react-redux'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
import {
  toggleAccountMenu,
  showAccountDetail,
  hideSidebar,
  lockMetamask,
  hideWarning,
  showConfigPage,
  showInfoPage,
  showModal,
  getCurrentWindowTab,
  getTabIdOrigins,
} from '../../../store/actions'
import { getMetaMaskAccounts, getAddressConnectedDomainMap } from '../../../selectors/selectors'

import AccountMenu from './account-menu.component'

function mapStateToProps (state) {
  const {
    metamask: {
      selectedAddress, isAccountMenuOpen, keyrings, identities,
    },
    appState: {
      openExternalTabs,
      tabIdOrigins,
    },
  } = state
  const originOfCurrentTab = tabIdOrigins[Object.keys(tabIdOrigins).find(id => openExternalTabs[id])]

  return {
    selectedAddress,
    isAccountMenuOpen,
    keyrings,
    identities,
    accounts: getMetaMaskAccounts(state),
    addressConnectedDomainMap: getAddressConnectedDomainMap(state),
    originOfCurrentTab,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    toggleAccountMenu: () => dispatch(toggleAccountMenu()),
    showAccountDetail: address => {
      dispatch(showAccountDetail(address))
      dispatch(hideSidebar())
      dispatch(toggleAccountMenu())
    },
    lockMetamask: () => {
      dispatch(lockMetamask())
      dispatch(hideWarning())
      dispatch(hideSidebar())
      dispatch(toggleAccountMenu())
    },
    showConfigPage: () => {
      dispatch(showConfigPage())
      dispatch(hideSidebar())
      dispatch(toggleAccountMenu())
    },
    showInfoPage: () => {
      dispatch(showInfoPage())
      dispatch(hideSidebar())
      dispatch(toggleAccountMenu())
    },
    showRemoveAccountConfirmationModal: identity => {
      return dispatch(showModal({ name: 'CONFIRM_REMOVE_ACCOUNT', identity }))
    },
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(AccountMenu)

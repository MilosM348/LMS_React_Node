import * as React from 'react'

const AssignmentContext = React.createContext()

function assignmentReducer(state, action) {
  switch (action.type) {
    case 'SET': {
      console.log(action)
      return {...state, [action.settingName]: action.settingData}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

export const AssignmentProvider = (props) => {
  const [setting, dispatch] = React.useReducer(assignmentReducer, {auth: null})
  return <AssignmentContext.Provider value={[setting, dispatch]} {...props} />
}

export const useAssignment = () => {
  const context = React.useContext(AssignmentContext)
  if (!context) {
    throw new Error('useAssignment must be used within a AssignmentProvider')
  }
  return context
}
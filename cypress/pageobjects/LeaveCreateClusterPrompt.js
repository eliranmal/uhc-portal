class LeaveCreateClusterPrompt {

  submit = () => {
    cy.getByTestId('submit-button').click();
  }

  cancel = () => {
    cy.getByTestId('cancel-button').click();
  }
}

export default new LeaveCreateClusterPrompt();

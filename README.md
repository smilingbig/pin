# Api quicklinks aka pin

## Docs template

- Project name and a brief description of what the project does.
- Installation instructions, including any dependencies that need to be installed.
- Usage instructions, including examples of how to use the project.
- A list of contributors and maintainers, including contact information.
- A guide to the project's code, including information on any relevant design patterns or algorithms used.
- A link to the project's license.
- A section for troubleshooting and frequently asked questions (FAQs).
- Links to any relevant documentation or resources.

## Functional requirements

- [ ] [gitlab] Open current gitlab repo's latest pipeline in gitlab web ui
- [ ] [gitlab] Same for latest merge request
- [ ] [gitlab] And also compare with main branch
- [ ] [gitlab] Open all merge requests for current repo
- [ ] [gitlab] Open merge requests by user, this will require an input
- [ ] [jira] Open jira ticket for current branch
- [ ] [aws] Open current repo in cloudformation

# TODO

- [x] Update api key to come from env vars
- [ ] Create the conditional caching methods eg cache until branch changes
- [ ] Error handling
- [ ] Update docs
- [ ] Create setup for inserting apikey
- [ ] Link and install/bundle etc for execution on command line
- [ ] Jira integration
- [ ] Move to a proper db solution, probably sqlite3
- [ ] Look at using gitlab api graphql
- [ ] Update main/command to deal with arguments it doesn't recognise
- [ ] Help menu and other command line defaults to investigate
- [ ] Need to make sure to sort results from apis
- [ ] Update db to work for multiple repos
- [ ] Update console logs to use process.std etc
- [ ] Failure cases if no results are found
- [ ] Improve logger to include more useful information
- [ ] Resolve issue with main branches not working
- [ ] Update build to happen on dev instead of tests
- [ ] Write those tests
- [ ] Need to look into generating types correctly with type declaration file
- [ ] Execution time isn't displaying correctly I don't think
- [ ] logging

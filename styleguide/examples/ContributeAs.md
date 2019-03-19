```js
const { default: profiles, personalProfile } = require('../mocks/profiles');

initialState = null;
<div style={{ display: 'flex', flexWrap: 'wrap' }}>
  <ContributeAs
    onProfileChange={setState}
    profiles={profiles}
    personal={personalProfile}
    defaultSelectedProfile={state || personalProfile}
    id="contribute-as"
    name="contribute-as"
  />
  <div style={{ margin: 24, maxWidth: 300 }}>
    <strong>State</strong>
    <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(state, null, 2)}</pre>
  </div>
</div>;
```

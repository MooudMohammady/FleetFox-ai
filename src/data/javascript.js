/* eslint-disable import/no-anonymous-default-export */
const javaScriptIntents = [
  {
    tag: "writeing",
    patterns: ["Hi,you can help me to write javascript code?"],
    responses: [
      `Hello, I am FleetFox.
> Yes I can help you!
> For example i can generate code like this : 
{notranslate}
\`\`\`js
for let i in Array(5){
  {/notranslate}
  // this code will write 5 time hello fleetfox
  {notranslate}
  console.log('Hello FleetFox!');
}
\`\`\`
{/notranslate}
`,
    ],
    context_set: "",
  },
];
export default javaScriptIntents

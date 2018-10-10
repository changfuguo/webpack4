const sandboxs = ['intro.example.com'];
const isSandBox = sandboxs.indexOf(location.host) > -1;
export default {
    isSandBox,
    sandboxs
};

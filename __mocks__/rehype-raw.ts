/* ******************************************
 * So I need to mock the RehypeRaw component in jest.config.js -> moduleNameMapper because it does not play nice with jest
 * ***************************************** */
const RehypeRaw = (content: any) => content;

export default RehypeRaw;

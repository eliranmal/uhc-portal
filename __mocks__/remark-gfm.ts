/* ******************************************
 * So I need to mock the RemarkGfm component in jest.config.js -> moduleNameMapper because it does not play nice with jest
 * ***************************************** */
const RemarkGfm = (content: any) => content;

export default RemarkGfm;

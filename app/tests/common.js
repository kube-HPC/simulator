import colors from 'colors';
function getMessage(message) {
  const length = (message.length);
  const margin = 5;
  const marginLeft = ' '.repeat(margin);
  const dashes = ' '.repeat(length + (margin * 2));
  return `${dashes}\n${marginLeft}${message}`;
}
colors.setTheme({
  alert: ['red', 'underline'],
  success: ['green', 'underline'],
  info: ['blue', 'underline'],
  final: ['underline']
});
export const generateMessage =  {
  info(message) {
    console.log(getMessage(message).info);
  },
  success(message) {
    console.log(getMessage(message).success);
  },
  alert(message) {
    console.log(getMessage(message).alert);
  },
  final(message) {
    console.log(getMessage(message).final);
  },
  default(message) {
    console.log(getMessage(message).underline);
  }
};

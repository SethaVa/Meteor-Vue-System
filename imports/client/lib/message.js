import { Message } from 'element-ui'

const MsgBox = {
  success(message = 'Success') {
    Message({
      type: 'success',
      showClose: true,
      message,
    })
  },
  warning(message) {
    message = message || 'Warning'
    Message({
      type: 'warning',
      showClose: true,
      message,
    })
  },
  info(message = 'Info') {
    Message({
      type: 'info',
      showClose: true,
      message,
    })
  },
  error(message = 'Error') {
    Message({
      type: 'error',
      showClose: true,
      message,
    })
  },
}

export default MsgBox

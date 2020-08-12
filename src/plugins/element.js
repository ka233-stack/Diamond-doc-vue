import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Avatar,
  Menu,
  Submenu,
  MenuItemGroup,
  MenuItem,
  Divider,
  Dropdown,
  DropdownItem
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Avatar)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Divider)
Vue.use(Dropdown)
Vue.use(DropdownItem)

// 全局挂载弹窗
Vue.prototype.$message = Message

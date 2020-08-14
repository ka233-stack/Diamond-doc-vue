import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Footer,
  Aside,
  Main,
  Avatar,
  Menu,
  Submenu,
  MenuItemGroup,
  MenuItem,
  Divider,
  Dropdown,
  DropdownItem,
  Badge,
  DropdownMenu,
  ButtonGroup,
  Card,
  Popover,
  Table,
  Link,
  TableColumn,
  Pagination,
  Breadcrumb,
  BreadcrumbItem,
  Dialog
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Footer)
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
Vue.use(DropdownMenu)
Vue.use(Badge)
Vue.use(ButtonGroup)
Vue.use(Card)
Vue.use(Popover)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Link)
Vue.use(Pagination)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Dialog)

// 全局挂载弹窗
Vue.prototype.$message = Message

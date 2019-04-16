
import Tabber from '@/components/Tabber'
import BillHall from '@/components/BillHall'
import TicketHolder from '@/components/TicketHolder'
import Order from '@/components/Order'
import SelfInfo from '@/components/SelfInfo'
import Register from '@/components/Register'
import Login from '@/components/Login'
import RealName from '@/components/RealName'
import SafeSetting from '@/components/SafeSetting'
import Caculate from '@/components/Caculate'
import ChangePassword from '@/components/ChangePassword'
import Fbpj from '@/components/Fbpj'
import BaseInfo from '@/components/BaseInfo'
import PreviewPdf from '@/components/PreviewPdf'
import RealNameChange from '@/components/RealNameChange'
import MatchBank from '@/components/MatchBank'
import AddBankCard from '@/components/AddBankCard'
import BankDetailInfo from '@/components/BankDetailInfo'

let routerData = {
  routes: [
  {
    path: '/home',
    name: 'Tabber',
    redirect: '/home/billHall',
    component: Tabber,
    meta:{
      isLogin: false,//是否需要登录权限
      isNChecked: false,//是否需要认证权限
    },
    children: [
    {
      path: '/home/billHall',
      name: 'BillHall',
      meta:{
        isLogin: true,//是否需要登录权限
        isNChecked: false,//是否需要认证权限
      },
      component: BillHall
    },
    {
      path: '/home/ticketHolder',
      name: 'TicketHolder',
      meta:{
        isLogin: true,
        isNChecked: true,
      },
      component: TicketHolder
    },
    {
      path: '/home/order',
      name: 'Order',
      meta:{
        isLogin: true,
        isNChecked: true,
      },
      component: Order
    },
    {
      path: '/home/selfInfo',
      name: 'SelfInfo',
      meta:{
        isLogin: true,
        isNChecked: false,
      },
      component: SelfInfo
    },
    {
      path: '/home/realName',
      name: 'RealName',
      meta:{
        isLogin: true,
        isNChecked: false,
      },
      component: RealName
    },
    {
      path: '/home/selfInfo/safeSetting',
      name: 'SafeSetting',
      meta:{
        isLogin: true,
        isNChecked: false,
      },
      component: SafeSetting
    },
    {
      path: '/home/selfInfo/caculate',
      name: 'Caculate',
      meta:{
        isLogin: true,
        isNChecked: false,
      },
      component: Caculate
    },
    {
      path: '/home/selfInfo/changePassword',
      name: 'ChangePassword',
      meta:{
        isLogin: true,
        isNChecked: false,
      },
      component: ChangePassword
    },
    {
      path: '/home/ticketHolder/fbpj',
      name: 'Fbpj',
      meta:{
        isLogin: true,
        isNChecked: true,
      },
      component: Fbpj
    },
    {
      path: '/home/selfInfo/baseInfo',
      name: 'BaseInfo',
      meta:{
        isLogin: true,
        isNChecked: false,
      },
      component: BaseInfo
    },
    {
      path: '/home/selfInfo/realNameChange',
      name: 'RealNameChange',
      meta:{
        isLogin: true,
        isNChecked: true,
      },
      component: RealNameChange
    },
    {
      path: '/home/selfInfo/matchBank',
      name: 'MatchBank',
      meta:{
        isLogin: true,
        isNChecked: true,
      },
      component: MatchBank
    },
    {
      path: '/home/selfInfo/addBankCard',
      name: 'MatchBank',
      meta:{
        isLogin: true,
        isNChecked: true,
      },
      component: AddBankCard
    },
    {
      path: '/home/selfInfo/bankDetailInfo',
      name: 'BankDetailInfo',
      meta:{
        isLogin: true,
        isNChecked: true,
      },
      component: BankDetailInfo
    }

    ]
  },
  {
    path: '/register',
    name: 'Register',
    meta:{
      isLogin: false,
      isNChecked: false,
    },
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    meta:{
      isLogin: false,
      isNChecked: false,
    },
    component: Login
  },
  {
    path: '/previewPdf',
    name: 'PreviewPdf',
    meta:{
      isLogin: false,
      isNChecked: false,
    },
    component: PreviewPdf
  }
  ]
}


export default routerData;

import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
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


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'Tabber',
      redirect: '/home/billHall',
      component: Tabber,
      children: [
	      {
	      	path: 'billHall',
	      	name: 'BillHall',
	      	component: BillHall
	      },
	      {
	      	path: 'ticketHolder',
	      	name: 'TicketHolder',
	      	component: TicketHolder
	      },
	      {
	      	path: 'order',
	      	name: 'Order',
	      	component: Order
	      },
	      {
	      	path: 'selfInfo',
	      	name: 'SelfInfo',
	      	component: SelfInfo
	      },
        {
          name: 'RealName',
          path: '/home/realName',
          component: RealName
        },
        {
          name: 'SafeSetting',
          path: '/home/selfInfo/safeSetting',
          component: SafeSetting
        },
        {
          name: 'Caculate',
          path: '/home/selfInfo/caculate',
          component: Caculate
        },
        {
          name: 'ChangePassword',
          path: '/home/selfInfo/changePassword',
          component: ChangePassword
        },
        {
          name: 'Fbpj',
          path: '/home/ticketHolder/fbpj',
          component: Fbpj
        }
      ]
    },
    {
  		path: '/register',
  		name: 'Register',
  		component: Register
  	},
  	{
  		path: '/login',
  		name: 'Login',
  		component: Login
  	}
  ]
})

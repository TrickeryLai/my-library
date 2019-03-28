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

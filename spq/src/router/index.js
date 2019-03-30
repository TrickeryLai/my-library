import Vue from 'vue'
import Router from 'vue-router'
import routerData from '@/router/routerData';

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

Vue.use(Router)

export default new Router(routerData);

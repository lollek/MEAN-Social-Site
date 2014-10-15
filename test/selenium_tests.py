#! /usr/bin/env python2
# -*- coding: utf-8 -*-

from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0
import time
import unittest
import sys
import time
import random

class Projecttest(unittest.TestCase):
	def setUp(self):
		self.root = "http://localhost:3000"
		self.driver = webdriver.Firefox()
		self.driver.get(self.root)

	def testRegister(self):
		self.driver.get(self.root + "/#!/auth/register")
		container = self.driver.find_elements_by_class_name("input-wrapper")
		name = container.find_element_by_name("name")
		name.send_keys("test")
		container[0].find_element_by_name("email").send_keys("test@test.se")
		container[1].find_element_by_name("username").send_keys("test"+ random.randrange(900000000000000000))
		container[2].find_element_by_name("password").send_keys("testtest")
		container[3].find_element_by_name("confirm_password").send_keys("testtest")
		container[4].find_element_by_class_name("submit_button").click()
		self.assertTrue(self.driver.current_url == self.root + "/#!/")


	def tearDown(self):
		self.driver.quit()

if __name__ == "__main__":
	unittest.main()
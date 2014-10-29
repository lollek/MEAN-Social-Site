#! /usr/bin/env python2
# -*- coding: utf-8 -*-

import time
import sys
import time
import random
import unittest
import collections


from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0

class Projecttest(unittest.TestCase):
    def setUp(self):
        self.root = "http://localhost:3000"
        self.wallPath = self.root + "/#!/user/"
        self.registerPath = self.root + "/#!/auth/register"
        self.loginPath = self.root + "/#!/auth/login"
        self.logoutPath = self.root + "/logout"
        self.loggedOutPath = self.root + "/#!/"
        self.searchPath = self.root + "/#!/search"
        self.friendsPath = self.root + "/#!/friends"

        self.driver = webdriver.Firefox()
        self.driver.get(self.root)

        self.makeExampleUsers()

    def assertErrorMsg(self, msg):
        err = self.driver.find_element_by_class_name("alert-danger")
        if err.text != msg: print err.text + " != " + msg
        self.assertTrue(err.text == msg)

    def assertPath(self, path):
        if self.driver.current_url != path:
            time.sleep(1) # Just in case we're too fast
        self.assertTrue(self.driver.current_url == path)

    def changePath(self, path):
        self.driver.get(path)
        time.sleep(0.5)

    def newUsername(self):
        return "test" + str(random.randrange(1000000000000000))

    def logout(self):
        self.changePath(self.logoutPath)

    def register(self, name, user, email, pw, pw2):
        self.changePath(self.registerPath)

        self.driver.find_element_by_id("name").send_keys(name)
        self.driver.find_element_by_id("email_block").send_keys(email)
        self.driver.find_element_by_id("username").send_keys(user)
        self.driver.find_element_by_id("password_block").send_keys(pw)
        self.driver.find_element_by_id("confirm_password").send_keys(pw2)
        self.driver.find_element_by_class_name("submit_button").click()

    def login(self, email, pw):
        self.changePath(self.loginPath)

        self.driver.find_element_by_id("email_block").send_keys(email)
        self.driver.find_element_by_id("password_block").send_keys(pw)
        self.driver.find_element_by_class_name("submit_button").click()

    def makeExampleUsers(self):
        User = collections.namedtuple("User",["user", "email", "passwd"])
        name = "Test Testsson"
        pw = "testtest"

        # Register #1
        username = self.newUsername()
        email = username+"@test.se"
        self.register(name, username, email, pw, pw)
        self.exampleUser1 = User(username, email, pw)
        self.logout()

        # Register #2
        username = self.newUsername()
        email = username+"@test.se"
        self.register(name, username, email, pw, pw)
        self.exampleUser2 = User(username, email, pw)
        self.logout()


    def tRegister(self):
        name = "Test Testsson"
        pw = "testtest"

        # Good:
        username = self.newUsername()
        self.register(name, username, username+"@test.se", pw, pw)
        self.assertPath(self.wallPath + username)
        self.logout()

        # Too long name
        username = "a23456789012345678901"
        self.register(name, username, username+"@test.se", pw, pw)
        self.assertPath(self.registerPath)
        self.assertErrorMsg("Username cannot be more than 20 characters")
        self.logout()

        # No username
        username = ""
        self.register(name, username, self.newUsername()+"@test.se", pw, pw)
        self.assertPath(self.registerPath)
        self.assertErrorMsg("") # The browser will prevent this
        self.logout()

        # No email
        username = self.newUsername()
        self.register(name, username, "", pw, pw)
        self.assertPath(self.registerPath)
        self.assertErrorMsg("") # The browser will prevent this
        self.logout()

        # Mismatching passwords
        username = self.newUsername()
        self.register(name, username, username+"@test.se", pw, "1"+pw)
        self.assertPath(self.registerPath)
        self.assertErrorMsg("Passwords do not match")
        self.logout()

    def tLogoutLogin(self):

        # Login
        self.login(self.exampleUser1.email, self.exampleUser1.passwd)
        self.assertPath(self.wallPath + self.exampleUser1.user)

        # Logout
        self.logout()
        self.assertPath(self.loggedOutPath)

    def tSearch(self):
        # Login
        self.login(self.exampleUser1.email, self.exampleUser1.passwd)
        self.assertPath(self.wallPath + self.exampleUser1.user)

        # Jump to search page
        self.changePath(self.searchPath)

        # Search for old user
        self.driver.find_element_by_id("content").send_keys(
                self.exampleUser2.email)
        self.driver.find_element_by_class_name("btn").click()
        time.sleep(1)
        isFound = False
        for span in self.driver.find_elements_by_tag_name("span"):
            if span.text == self.exampleUser2.email:
                isFound = True
                break
        self.assertTrue(isFound)

        # Search for non-existant user
        self.driver.find_element_by_id("content").send_keys("qweqweqwe")
        self.driver.find_element_by_class_name("btn").click()
        time.sleep(1)
        isFound = False
        for span in self.driver.find_elements_by_tag_name("h1"):
            if span.text == "No user found :(":
                isFound = True
                break
        self.assertTrue(isFound)

        self.logout()

    def tAddFriend(self):
        # Login
        self.login(self.exampleUser1.email, self.exampleUser1.passwd)
        self.assertPath(self.wallPath + self.exampleUser1.user)

        # Make sure friend is not already added
        self.changePath(self.friendsPath)
        self.assertPath(self.friendsPath)
        hasFriend = False
        for span in self.driver.find_elements_by_tag_name("span"):
            if span.text == self.exampleUser2.user:
                hasFriend = True
                break
        self.assertTrue(not hasFriend)


        # Jump to friend's page and add them
        self.changePath(self.wallPath + self.exampleUser2.user)
        self.assertPath(self.wallPath + self.exampleUser2.user)
        for a in self.driver.find_elements_by_tag_name("a"):
            if a.text.find(self.exampleUser2.user) != -1:
                a.click()
                break
        time.sleep(1)
        isFriend = False
        for h3 in self.driver.find_elements_by_tag_name("h3"):
            if h3.text.find("Friends Yo!") != -1:
                isFriend = True
                break
        self.assertTrue(isFriend)

        # Make sure we now have a friend
        self.changePath(self.friendsPath)
        self.assertPath(self.friendsPath)
        hasFriend = False
        for span in self.driver.find_elements_by_tag_name("span"):
            if span.text == self.exampleUser2.user:
                hasFriend = True
                break
        self.assertTrue(hasFriend)


        self.logout()

    def tPostToWall(self):
        # Login
        self.login(self.exampleUser1.email, self.exampleUser1.passwd)
        self.assertPath(self.wallPath + self.exampleUser1.user)

        # Jump to user's page
        self.changePath(self.wallPath + self.exampleUser2.user)
        self.assertPath(self.wallPath + self.exampleUser2.user)

        # Post!
        msg1 = "Lorem Ipsum"
        self.driver.find_element_by_id("content").send_keys(msg1)
        self.driver.find_element_by_class_name("btn").click()

        msg2 = "First Post! tralalalalalal"
        self.driver.find_element_by_id("content").send_keys(msg2)
        self.driver.find_element_by_class_name("btn").click()

        # Find the posts!
        time.sleep(1)
        areFound = False
        for div in self.driver.find_elements_by_tag_name("div"):
            if msg1 is not None and div.text.find(msg1):
                msg1 = None
                continue
            if msg2 is not None and div.text.find(msg2):
                msg2 = None
                continue
            if msg1 is None and msg2 is None:
                areFound = True
                break
        self.assertTrue(areFound)

        self.logout()

    def testAll(self):
        self.tRegister()
        self.tLogoutLogin()
        self.tSearch()
        self.tAddFriend()
        self.tPostToWall()

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()

import unittest

import app as app_module


class AuthFlowTests(unittest.TestCase):
    def setUp(self):
        self.app = app_module.app.test_client()

    def test_register_and_login_flow(self):
        with app_module.app.app_context():
            app_module.USERS.clear()

        register_response = self.app.post(
            '/register',
            data={
                'name': 'Alice Student',
                'email': 'alice@nie.ac.in',
                'password': 'secret123',
            },
            follow_redirects=True,
        )
        self.assertEqual(register_response.status_code, 200)
        self.assertIn(b'Welcome', register_response.data)

        login_response = self.app.post(
            '/login',
            data={
                'email': 'alice@nie.ac.in',
                'password': 'secret123',
            },
            follow_redirects=True,
        )
        self.assertEqual(login_response.status_code, 200)
        self.assertIn(b'Welcome', login_response.data)

    def test_protected_pages_redirect_to_login(self):
        with app_module.app.app_context():
            app_module.USERS.clear()

        reported_response = self.app.get('/reported', follow_redirects=True)
        self.assertEqual(reported_response.status_code, 200)
        self.assertIn(b'Login', reported_response.data)

        report_response = self.app.get('/report', follow_redirects=True)
        self.assertEqual(report_response.status_code, 200)
        self.assertIn(b'Login', report_response.data)


if __name__ == '__main__':
    unittest.main()

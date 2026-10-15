import unittest

import app as app_module


class FakeCursor:
    def __init__(self):
        self.executed = []

    def execute(self, query, params=None):
        self.executed.append((query, params))

    def close(self):
        pass


class AuthFlowTests(unittest.TestCase):
    def setUp(self):
        self.app = app_module.app.test_client()

    def test_single_email_access_page_has_no_password_or_registration(self):
        response = self.app.get('/login')

        self.assertEqual(response.status_code, 200)
        self.assertIn(b'name="email"', response.data)
        self.assertNotIn(b'name="password"', response.data)
        self.assertNotIn(b'Register', response.data)

    def test_only_nie_email_can_access_protected_pages(self):
        for email in ('alice@example.com', '@nie.ac.in', 'alice@nie.ac.in.evil'):
            with self.subTest(email=email):
                denied_response = self.app.post('/login', data={'email': email})
                self.assertEqual(denied_response.status_code, 200)
                self.assertIn(b'ending in @nie.ac.in', denied_response.data)

        self.assertEqual(self.app.get('/report').status_code, 302)

        accepted_response = self.app.post(
            '/login',
            data={'email': 'Alice@NIE.AC.IN'},
            follow_redirects=True,
        )
        self.assertEqual(accepted_response.status_code, 200)
        self.assertIn(b'Welcome, alice!', accepted_response.data)
        self.assertEqual(self.app.get('/report').status_code, 200)

    def test_report_uses_authenticated_email_not_submitted_email(self):
        fake_cursor = FakeCursor()

        class FakeConnection:
            def cursor(self):
                return fake_cursor

            def commit(self):
                pass

        class DummyMySQL:
            connection = FakeConnection()

        with self.app.session_transaction() as sess:
            sess['user_email'] = 'student@nie.ac.in'

        original_mysql = app_module.mysql
        app_module.mysql = DummyMySQL()
        try:
            response = self.app.post(
                '/submit',
                data={
                    'name': 'Lost keys',
                    'email': 'attacker@example.com',
                    'phone': '1234567890',
                    'category': 'others',
                    'description': 'A set of keys',
                    'reportedDate': '2026-10-14',
                    'status': 'lost',
                },
            )
        finally:
            app_module.mysql = original_mysql

        self.assertEqual(response.status_code, 302)
        self.assertEqual(len(fake_cursor.executed), 1)
        self.assertEqual(fake_cursor.executed[0][1][1], 'student@nie.ac.in')


if __name__ == '__main__':
    unittest.main()

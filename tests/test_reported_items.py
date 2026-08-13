import unittest

import app as app_module


class FakeCursor:
    def __init__(self):
        self.executed = []

    def execute(self, query, params=None):
        self.executed.append((query, params))

    def fetchall(self):
        return []

    def close(self):
        pass


class ReportedItemsRouteTests(unittest.TestCase):
    def setUp(self):
        self.app = app_module.app.test_client()

    def test_reported_items_applies_keyword_and_category_filters(self):
        fake_cursor = FakeCursor()

        class FakeConnection:
            def cursor(self):
                return fake_cursor

        class DummyMySQL:
            connection = FakeConnection()

        with app_module.app.app_context():
            original = app_module.mysql
            app_module.mysql = DummyMySQL()
            try:
                response = self.app.get('/reported?q=wallet&category=electronics')
                self.assertEqual(response.status_code, 200)
                self.assertTrue(fake_cursor.executed)
                sql, params = fake_cursor.executed[0]
                self.assertIn("status = 'found'", sql)
                self.assertIn("category = %s", sql)
                self.assertIn("LIKE LOWER(%s)", sql)
                self.assertIn("%wallet%", params)
                self.assertIn("electronics", params)
            finally:
                app_module.mysql = original


if __name__ == '__main__':
    unittest.main()

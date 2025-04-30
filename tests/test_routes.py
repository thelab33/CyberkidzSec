# tests/test_routes.py
import json
import pytest
from src.app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    return app.test_client()

# Smoke-test all index routes
@pytest.mark.parametrize("path", [
    "/", "/academy", "/dashboard", "/playground",
    "/vault", "/labs", "/dashboard", "/playground",
    "/scanner", "/api", "/contracts", "/assistant",
])
def test_index_pages(client, path):
    rv = client.get(path)
    assert rv.status_code == 200
    assert b"<h1" in rv.data  # header present

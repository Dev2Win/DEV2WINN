from __future__ import annotations

import pytest

from app.connectors.db import DbConnectorContext, DbConnectorError, Dev2WinDbConnector


def test_db_connector_direct_access_disabled_by_default():
    connector = Dev2WinDbConnector()
    with pytest.raises(DbConnectorError, match="Direct DB access is disabled"):
        import anyio

        anyio.run(connector.call_proc, "sp_user_get_by_id", ["u1"])


def test_db_connector_builds_service_jwt():
    connector = Dev2WinDbConnector()
    token = connector.service_jwt(DbConnectorContext(user_id="u1"))
    assert isinstance(token, str)
    assert token.count(".") == 2

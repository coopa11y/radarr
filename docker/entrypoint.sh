#!/usr/bin/env bash
set -euo pipefail

PUID="${PUID:-99}"
PGID="${PGID:-100}"
UMASK="${UMASK:-002}"

mkdir -p /config

if ! getent group "${PGID}" >/dev/null; then
  groupadd --gid "${PGID}" radarr
fi

if ! getent passwd "${PUID}" >/dev/null; then
  useradd \
    --uid "${PUID}" \
    --gid "${PGID}" \
    --home-dir /config \
    --no-create-home \
    --shell /usr/sbin/nologin \
    radarr
fi

chown -R "${PUID}:${PGID}" /config
umask "${UMASK}"

exec gosu "${PUID}:${PGID}" /opt/radarr/Radarr -nobrowser -data=/config "$@"

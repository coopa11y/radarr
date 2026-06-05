FROM mcr.microsoft.com/dotnet/runtime-deps:8.0-jammy

ARG RADARRVERSION
ARG RADARRBRANCH=master

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates gosu \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/radarr

COPY _artifacts/linux-x64/net8.0/Radarr/ /opt/radarr/
COPY docker/entrypoint.sh /usr/local/bin/radarr-entrypoint

RUN chmod +x /usr/local/bin/radarr-entrypoint /opt/radarr/Radarr \
  && find /opt/radarr -maxdepth 1 -type f \( -name ffmpeg -o -name ffprobe \) -exec chmod +x {} \; \
  && if [ -n "$RADARRVERSION" ]; then printf 'ReleaseVersion=%s\nBranch=%s\n' "$RADARRVERSION" "$RADARRBRANCH" > /opt/radarr/release_info; fi

VOLUME ["/config"]
EXPOSE 7878

ENTRYPOINT ["/usr/local/bin/radarr-entrypoint"]

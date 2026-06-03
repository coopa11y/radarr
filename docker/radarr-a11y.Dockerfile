FROM mcr.microsoft.com/dotnet/runtime-deps:8.0-jammy

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates gosu \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/radarr

COPY _artifacts/linux-x64/net8.0/Radarr/ /opt/radarr/
COPY docker/entrypoint.sh /usr/local/bin/radarr-entrypoint

RUN chmod +x \
  /usr/local/bin/radarr-entrypoint \
  /opt/radarr/Radarr \
  /opt/radarr/ffmpeg \
  /opt/radarr/ffprobe

VOLUME ["/config"]
EXPOSE 7878

ENTRYPOINT ["/usr/local/bin/radarr-entrypoint"]

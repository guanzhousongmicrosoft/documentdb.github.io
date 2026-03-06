"use client";

import Link from "next/link";
import { useState } from "react";
import CommandSnippet from "../components/CommandSnippet";

type InstallMethod = "docker" | "packages";
type PackageFamily = "apt" | "rpm";
type AptDistro = "ubuntu22" | "ubuntu24" | "deb11" | "deb12" | "deb13";
type RpmDistro = "rhel8" | "rhel9";
type AptArch = "amd64" | "arm64";
type RpmArch = "x86_64" | "aarch64";
type AptPgVersion = "16" | "17";
type RpmPgVersion = "16" | "17";

const dockerCommand = `docker run -dt --name documentdb \\
  -p 10260:10260 \\
  ghcr.io/documentdb/documentdb/documentdb-local:latest \\
  --username <YOUR_USERNAME> \\
  --password <YOUR_PASSWORD>`;

const aptTargetLabels: Record<AptDistro, string> = {
  ubuntu22: "Ubuntu 22.04 (Jammy)",
  ubuntu24: "Ubuntu 24.04 (Noble)",
  deb11: "Debian 11 (Bullseye)",
  deb12: "Debian 12 (Bookworm)",
  deb13: "Debian 13 (Trixie)",
};

const rpmTargetLabels: Record<RpmDistro, string> = {
  rhel8: "RHEL 8 / Rocky 8 / AlmaLinux 8 / CentOS Stream 8",
  rhel9: "RHEL 9 / Rocky 9 / AlmaLinux 9 / CentOS Stream 9",
};

const nextGuides = [
  {
    title: "Getting started",
    description: "See the full setup flow and choose the guide that fits your environment.",
    href: "/docs/getting-started",
  },
  {
    title: "Python",
    description: "Install PyMongo and connect to your local DocumentDB instance.",
    href: "/docs/getting-started/python-setup",
  },
  {
    title: "Node.js",
    description: "Use the Node.js driver and run your first queries locally.",
    href: "/docs/getting-started/nodejs-setup",
  },
  {
    title: "VS Code",
    description: "Connect through the VS Code extension for a guided local workflow.",
    href: "/docs/getting-started/vscode-quickstart",
  },
] as const;

const allReleasesUrl = "https://github.com/documentdb/documentdb/releases";

export default function PackagesPage() {
  const [method, setMethod] = useState<InstallMethod>("docker");
  const [packageFamily, setPackageFamily] = useState<PackageFamily>("apt");
  const [aptTarget, setAptTarget] = useState<AptDistro>("ubuntu22");
  const [rpmTarget, setRpmTarget] = useState<RpmDistro>("rhel9");
  const [aptArch, setAptArch] = useState<AptArch>("amd64");
  const [rpmArch, setRpmArch] = useState<RpmArch>("x86_64");
  const [aptPgVersion, setAptPgVersion] = useState<AptPgVersion>("16");
  const [rpmPgVersion, setRpmPgVersion] = useState<RpmPgVersion>("16");

  const aptCommand = `curl -fsSL https://documentdb.io/documentdb-archive-keyring.gpg | sudo gpg --dearmor -o /usr/share/keyrings/documentdb-archive-keyring.gpg && \\
echo "deb [arch=${aptArch} signed-by=/usr/share/keyrings/documentdb-archive-keyring.gpg] https://documentdb.io/deb stable ${aptTarget}" | sudo tee /etc/apt/sources.list.d/documentdb.list && \\
sudo apt update && \\
sudo apt install postgresql-${aptPgVersion}-documentdb`;
  const rpmCommand = `sudo dnf install -y dnf-plugins-core && \\
sudo dnf config-manager --set-enabled crb && \\
sudo rpm --import https://documentdb.io/documentdb-archive-keyring.gpg && \\
printf '%s\\n' \\
  '[documentdb]' \\
  'name=DocumentDB Repository' \\
  'baseurl=https://documentdb.io/rpm/${rpmTarget}' \\
  'enabled=1' \\
  'gpgcheck=1' \\
  'gpgkey=https://documentdb.io/documentdb-archive-keyring.gpg' | sudo tee /etc/yum.repos.d/documentdb.repo >/dev/null && \\
sudo dnf install postgresql${rpmPgVersion}-documentdb`;
  const selectedPackageName =
    packageFamily === "apt"
      ? `postgresql-${aptPgVersion}-documentdb`
      : `postgresql${rpmPgVersion}-documentdb`;
  const selectedTargetText =
    packageFamily === "apt" ? aptTargetLabels[aptTarget] : rpmTargetLabels[rpmTarget];
  const selectedArchText = packageFamily === "apt" ? aptArch : rpmArch;

  return (
    <div className="min-h-screen bg-neutral-900 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-4xl font-extrabold text-white sm:text-5xl">
            Download DocumentDB
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-gray-300">
            Choose Docker for the fastest local setup, or Linux packages for managed host
            installations. All packages are GPG-signed and served from the official DocumentDB
            repository.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm">
            <span className="rounded-full border border-green-500/30 bg-green-500/20 px-3 py-1 text-green-300">
              GPG Signed Packages
            </span>
            <span className="rounded-full border border-blue-500/30 bg-blue-500/20 px-3 py-1 text-blue-300">
              Docker + Linux Packages
            </span>
            <span className="rounded-full border border-purple-500/30 bg-purple-500/20 px-3 py-1 text-purple-300">
              AMD64 + ARM64
            </span>
          </div>
        </div>

        <section className="mb-6 rounded-xl border border-neutral-700 bg-neutral-800/70 p-6">
          <h2 className="mb-4 text-2xl font-bold text-white">1. Choose your install method</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setMethod("docker")}
              className={`rounded-lg border px-4 py-4 text-left transition-colors ${
                method === "docker"
                  ? "border-blue-400 bg-blue-500/15"
                  : "border-neutral-700 bg-neutral-800 hover:bg-neutral-700/70"
              }`}
            >
              <p className="text-lg font-semibold text-white">Docker</p>
              <p className="text-sm text-gray-300">Best for: quick local setup and evaluation. No PostgreSQL installation required.</p>
            </button>
            <button
              type="button"
              onClick={() => setMethod("packages")}
              className={`rounded-lg border px-4 py-4 text-left transition-colors ${
                method === "packages"
                  ? "border-blue-400 bg-blue-500/15"
                  : "border-neutral-700 bg-neutral-800 hover:bg-neutral-700/70"
              }`}
            >
              <p className="text-lg font-semibold text-white">Linux Packages</p>
              <p className="text-sm text-gray-300">
                Best for: persistent Linux VM or server environments. Debian/Ubuntu and RHEL family.
              </p>
            </button>
          </div>
        </section>

        <section className="mb-8 rounded-xl border border-neutral-700 bg-neutral-800/70 p-6">
          <h2 className="mb-4 text-2xl font-bold text-white">
            2. Copy and run this command
          </h2>

          {method === "docker" ? (
            <>
              <CommandSnippet command={dockerCommand} label="Docker" />
              <p className="mt-3 text-sm text-gray-400">
                Starts DocumentDB locally on port 10260 for quick evaluation and development.
              </p>
              <div className="mt-4">
                <Link
                  href="/docs/getting-started/docker"
                  className="inline-flex items-center justify-center rounded-md border border-blue-400 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200 transition-colors hover:bg-blue-500/20"
                >
                  Open Docker quick start →
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="mb-5 rounded-lg border border-neutral-700 bg-neutral-900/60 p-4">
                <p className="mb-3 text-sm font-semibold text-white">Package Finder</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-xs font-medium text-gray-300">
                    Package format
                    <select
                      value={packageFamily}
                      onChange={(event) => setPackageFamily(event.target.value as PackageFamily)}
                      className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-gray-100"
                    >
                      <option value="apt">APT (Debian / Ubuntu)</option>
                      <option value="rpm">RPM (RHEL family)</option>
                    </select>
                  </label>

                  {packageFamily === "apt" ? (
                    <label className="text-xs font-medium text-gray-300">
                      Distribution
                      <select
                        value={aptTarget}
                        onChange={(event) => setAptTarget(event.target.value as AptDistro)}
                        className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-gray-100"
                      >
                        {Object.entries(aptTargetLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : (
                    <label className="text-xs font-medium text-gray-300">
                      Distribution
                      <select
                        value={rpmTarget}
                        onChange={(event) => setRpmTarget(event.target.value as RpmDistro)}
                        className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-gray-100"
                      >
                        {Object.entries(rpmTargetLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}

                  {packageFamily === "apt" ? (
                    <label className="text-xs font-medium text-gray-300">
                      Architecture
                      <select
                        value={aptArch}
                        onChange={(event) => setAptArch(event.target.value as AptArch)}
                        className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-gray-100"
                      >
                        <option value="amd64">amd64</option>
                        <option value="arm64">arm64</option>
                      </select>
                    </label>
                  ) : (
                    <label className="text-xs font-medium text-gray-300">
                      Architecture
                      <select
                        value={rpmArch}
                        onChange={(event) => setRpmArch(event.target.value as RpmArch)}
                        className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-gray-100"
                      >
                        <option value="x86_64">x86_64</option>
                        <option value="aarch64">aarch64</option>
                      </select>
                    </label>
                  )}

                  {packageFamily === "apt" ? (
                    <label className="text-xs font-medium text-gray-300">
                      PostgreSQL version
                      <select
                        value={aptPgVersion}
                        onChange={(event) => setAptPgVersion(event.target.value as AptPgVersion)}
                        className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-gray-100"
                      >
                        <option value="16">16</option>
                        <option value="17">17</option>
                      </select>
                    </label>
                  ) : (
                    <label className="text-xs font-medium text-gray-300">
                      PostgreSQL version
                      <select
                        value={rpmPgVersion}
                        onChange={(event) => setRpmPgVersion(event.target.value as RpmPgVersion)}
                        className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-gray-100"
                      >
                        <option value="16">16</option>
                        <option value="17">17</option>
                      </select>
                    </label>
                  )}
                </div>
              </div>

              <CommandSnippet
                command={packageFamily === "apt" ? aptCommand : rpmCommand}
                label={packageFamily === "apt" ? "APT" : "RPM"}
              />
              <p className="mt-3 text-sm text-gray-400">
                Target: {selectedTargetText} · Architecture: {selectedArchText} · package name{" "}
                <code className="text-gray-300">{selectedPackageName}</code>
              </p>
              <div className="mt-4">
                <Link
                  href="/docs/getting-started/packages"
                  className="inline-flex items-center justify-center rounded-md border border-blue-400 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200 transition-colors hover:bg-blue-500/20"
                >
                  Full package install guide →
                </Link>
              </div>
            </>
          )}
        </section>

        <section className="space-y-4">
          <details className="rounded-lg border border-neutral-700 bg-neutral-800/60 p-5">
            <summary className="cursor-pointer text-lg font-semibold text-white">
              Full package catalog (all supported combinations)
            </summary>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-700 text-gray-300">
                    <th className="px-3 py-2 font-semibold">Format</th>
                    <th className="px-3 py-2 font-semibold">Distributions</th>
                    <th className="px-3 py-2 font-semibold">Architectures</th>
                    <th className="px-3 py-2 font-semibold">PostgreSQL versions</th>
                    <th className="px-3 py-2 font-semibold">Package naming</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-neutral-800">
                    <td className="px-3 py-3 font-semibold text-blue-300">APT</td>
                    <td className="px-3 py-3">Ubuntu 22.04/24.04, Debian 11/12/13</td>
                    <td className="px-3 py-3">amd64, arm64</td>
                    <td className="px-3 py-3">16, 17</td>
                    <td className="px-3 py-3">
                      <code className="text-gray-200">postgresql-&lt;pg&gt;-documentdb</code>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 font-semibold text-red-300">RPM</td>
                    <td className="px-3 py-3">
                      RHEL 8/9, Rocky, AlmaLinux, CentOS Stream
                    </td>
                    <td className="px-3 py-3">x86_64, aarch64</td>
                    <td className="px-3 py-3">16, 17</td>
                    <td className="px-3 py-3">
                      <code className="text-gray-200">postgresql&lt;pg&gt;-documentdb</code>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="mt-3 text-xs text-gray-400">
                Use Package Finder above to generate the exact command for your selected
                target instead of scanning all combinations manually.
              </p>
            </div>
          </details>

          <details className="rounded-lg border border-neutral-700 bg-neutral-800/60 p-5">
            <summary className="cursor-pointer text-lg font-semibold text-white">
              Version pinning and listing available versions
            </summary>
            <div className="mt-4 space-y-4">
              <p className="text-sm text-gray-400">
                Use the commands below to discover available versions before pinning. Replace{" "}
                <code className="text-gray-300">&lt;VERSION&gt;</code> with the version string
                shown by the list command (e.g.{" "}
                <code className="text-gray-300">0.108-0</code> for APT,{" "}
                <code className="text-gray-300">0.108.0-1.el9</code> for RPM).
              </p>
              <div>
                <p className="mb-1 text-xs font-semibold text-gray-400">APT — list then pin</p>
                <div className="rounded-md border border-neutral-700 bg-black p-3">
                  <code className="text-xs text-green-400 sm:text-sm">
                    apt-cache madison postgresql-16-documentdb
                  </code>
                </div>
                <div className="mt-2 rounded-md border border-neutral-700 bg-black p-3">
                  <code className="text-xs text-green-400 sm:text-sm">
                    sudo apt install postgresql-16-documentdb=&lt;VERSION&gt;
                  </code>
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold text-gray-400">RPM — list then pin</p>
                <div className="rounded-md border border-neutral-700 bg-black p-3">
                  <code className="text-xs text-green-400 sm:text-sm">
                    dnf --showduplicates list postgresql16-documentdb
                  </code>
                </div>
                <div className="mt-2 rounded-md border border-neutral-700 bg-black p-3">
                  <code className="text-xs text-green-400 sm:text-sm">
                    sudo dnf install postgresql16-documentdb-&lt;VERSION&gt;
                  </code>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                See all releases and release notes on{" "}
                <a
                  href={allReleasesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  GitHub Releases
                </a>
                .
              </p>
            </div>
          </details>

          <details className="rounded-lg border border-neutral-700 bg-neutral-800/60 p-5">
            <summary className="cursor-pointer text-lg font-semibold text-white">
              Direct package downloads
            </summary>
            <div className="mt-4 space-y-3">
              <p className="text-sm text-gray-400">
                Individual <code className="text-gray-300">.deb</code> and{" "}
                <code className="text-gray-300">.rpm</code> files are attached to each release on
                GitHub. Package names follow the convention:
              </p>
              <div className="rounded-md border border-neutral-700 bg-black p-3 text-xs text-green-400 sm:text-sm">
                <div>ubuntu22.04-postgresql-16-documentdb_&lt;VERSION&gt;_amd64.deb</div>
                <div className="mt-1">rhel9-postgresql16-documentdb-&lt;VERSION&gt;.el9.x86_64.rpm</div>
              </div>
              <a
                href={allReleasesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-blue-400 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200 transition-colors hover:bg-blue-500/20"
              >
                Browse releases on GitHub →
              </a>
            </div>
          </details>

          <details className="rounded-lg border border-neutral-700 bg-neutral-800/60 p-5">
            <summary className="cursor-pointer text-lg font-semibold text-white">
              Troubleshooting quick checks
            </summary>
            <div className="mt-4 space-y-3">
              <div className="rounded-md border border-neutral-700 bg-black p-3">
                <code className="text-xs text-green-400 sm:text-sm">
                  sudo apt update && apt search documentdb && apt-cache policy
                  postgresql-16-documentdb
                </code>
              </div>
              <div className="rounded-md border border-neutral-700 bg-black p-3">
                <code className="text-xs text-green-400 sm:text-sm">
                  sudo dnf clean all && dnf search documentdb && rpm -qi postgresql16-documentdb
                </code>
              </div>
            </div>
          </details>
        </section>

        <section className="mt-8 rounded-xl border border-neutral-700 bg-neutral-800/70 p-5 sm:p-6">
          <div className="mb-5 max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
              3. Connect and try it
            </p>
            <h2 className="text-2xl font-bold text-white">Choose your next guide</h2>
            <p className="mt-2 text-sm leading-6 text-gray-400">
              Once DocumentDB is running, use port 10260 and follow one of these guides to make
              your first connection.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {nextGuides.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="group rounded-xl border border-neutral-700 bg-neutral-900/70 p-4 transition hover:border-blue-400/40 hover:bg-neutral-900"
              >
                <h3 className="text-lg font-semibold text-white transition group-hover:text-blue-200">
                  {guide.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-400">{guide.description}</p>
              </Link>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/docs/getting-started/packages"
              className="inline-flex items-center justify-center rounded-md border border-neutral-600 px-4 py-2 text-sm font-semibold text-gray-200 transition-colors hover:border-neutral-500 hover:bg-neutral-800"
            >
              Linux package guide
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center justify-center rounded-md border border-neutral-600 px-4 py-2 text-sm font-semibold text-gray-200 transition-colors hover:border-neutral-500 hover:bg-neutral-800"
            >
              All docs
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

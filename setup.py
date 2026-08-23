#!/usr/bin/env python3
"""
Setup script for GNOME Terminal 3.14.02
"""

from setuptools import setup, find_packages

setup(
    name="gnome-terminal",
    version="3.13.0",
    description="A VTE and GTK-based terminal emulator mimicking Ubuntu 26.04 LTS",
    author="TrueTreasureTT",
    license="GPL-3.0",
    python_requires=">=3.7",
    install_requires=[
        "PyGObject>=3.42.0",
    ],
    scripts=["gnome_terminal.py"],
    entry_points={
        "console_scripts": [
            "gnome-terminal=gnome_terminal:main",
        ],
    },
    classifiers=[
        "Development Status :: 4 - Beta",
        "Environment :: X11 :: GTK",
        "Intended Audience :: End Users/Desktop",
        "License :: OSI Approved :: GNU General Public License v3 (GPLv3)",
        "Programming Language :: Python :: 3",
        "Topic :: System :: Shells",
    ],
)

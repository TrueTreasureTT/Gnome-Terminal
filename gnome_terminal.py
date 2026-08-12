#!/usr/bin/env python3
"""
GNOME Terminal 3.14.02
A VTE and GTK-based terminal emulator mimicking Ubuntu 26.04 LTS.

A black terminal with Space Grotesk font and interactive command input.
"""

import gi
import sys
import subprocess

gi.require_version('Gtk', '3.0')
gi.require_version('Vte', '2.91')

from gi.repository import Gtk, Vte, GLib, Gdk

class GnomeTerminal3140(Gtk.Window):
    """
    GNOME Terminal 3.14.02 - A terminal emulator with black background
    and Space Grotesk font family.
    """
    
    VERSION = "3.14.02"
    APP_NAME = "Gnome-terminal"
    
    def __init__(self):
        Gtk.Window.__init__(self, type=Gtk.WindowType.TOPLEVEL)
        
        # Window configuration
        self.set_title(f"{self.APP_NAME} {self.VERSION}")
        self.set_default_size(800, 600)
        self.set_icon_name("utilities-terminal")
        
        # Apply dark theme
        self.apply_dark_theme()
        
        # Create terminal
        self.terminal = Vte.Terminal()
        self.configure_terminal()
        
        # Create container
        vbox = Gtk.Box(orientation=Gtk.Orientation.VERTICAL)
        vbox.pack_start(self.terminal, True, True, 0)
        self.add(vbox)
        
        # Connect signals
        self.terminal.connect("child-exited", self.on_terminal_exit)
        self.connect("destroy", self.on_window_destroy)
        
        # Spawn shell
        self.spawn_shell()
        
        self.show_all()
    
    def apply_dark_theme(self):
        """Apply dark theme to the terminal window."""
        settings = Gtk.Settings.get_default()
        settings.set_property("gtk-application-prefer-dark-theme", True)
        
        # Create and apply CSS for darker styling
        css_provider = Gtk.CssProvider()
        css_data = b"""
        window {
            background-color: #000000;
            color: #FFFFFF;
        }
        """
        css_provider.load_from_data(css_data)
        context = Gtk.StyleContext()
        context.add_provider_for_screen(
            Gdk.Screen.get_default(),
            css_provider,
            Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
        )
    
    def configure_terminal(self):
        """Configure terminal appearance and behavior."""
        # Black background with white text
        self.terminal.set_color_background(Gdk.RGBA(0, 0, 0, 1))
        self.terminal.set_color_foreground(Gdk.RGBA(1, 1, 1, 1))
        
        # Configure font: Space Grotesk
        font_desc = "Space Grotesk 11"
        self.terminal.set_font_from_string(font_desc)
        
        # Terminal properties
        self.terminal.set_scroll_on_output(True)
        self.terminal.set_scroll_on_keystroke(True)
        self.terminal.set_scrollback_lines(1000)
        self.terminal.set_word_char_exceptions("-,./?%&#:_")
        
        # Enable bell
        self.terminal.set_audible_bell(False)
        self.terminal.set_visible_bell(True)
    
    def spawn_shell(self):
        """Spawn a shell in the terminal."""
        try:
            # Get user's shell or default to bash
            shell = os.environ.get('SHELL', '/bin/bash')
            
            # Spawn the shell
            self.terminal.spawn_sync(
                Vte.PtyFlags.DEFAULT,
                os.environ.get('HOME', '/root'),
                [shell],
                [],
                GLib.SpawnFlags.SEARCH_PATH,
                None, None
            )
        except GLib.GError as e:
            print(f"Error spawning shell: {e}")
            sys.exit(1)
    
    def on_terminal_exit(self, terminal):
        """Handle terminal exit."""
        Gtk.main_quit()
    
    def on_window_destroy(self, widget):
        """Handle window close."""
        Gtk.main_quit()


def main():
    """Main entry point for the terminal application."""
    app = GnomeTerminal3140()
    try:
        Gtk.main()
    except KeyboardInterrupt:
        sys.exit(0)


if __name__ == "__main__":
    import os
    main()

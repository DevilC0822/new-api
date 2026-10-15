package common

import (
	"fmt"
	"html"
	"strings"
	"time"
)

// Branded HTML email layout matching the landing page porcelain style. Email
// clients require inline styles and table layout, so everything below is
// attribute-level markup; no <style> blocks are emitted.

const (
	emailFontSans  = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif`
	emailFontSerif = `Georgia,'Times New Roman','Songti SC','SimSun',serif`
	emailFontMono  = `ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,'Liberation Mono',monospace`
)

// EmailLayout carries the pieces of a branded outbound email. Localized text
// arrives already translated; only layout-owned text (brand, year) is fixed.
type EmailLayout struct {
	// Preheader is the hidden inbox preview snippet; defaults to SystemName.
	Preheader string
	// Content is the body HTML fragment placed inside the card.
	Content string
	// Footer is an optional localized small-print line above the brand row.
	Footer string
	// LogoURL is an absolute logo image URL; empty renders a text wordmark.
	LogoURL string
	// SiteURL links the footer brand name; empty renders plain text.
	SiteURL string
}

// RenderEmail wraps a body fragment in the branded document shell.
func RenderEmail(layout EmailLayout) string {
	preheader := layout.Preheader
	if preheader == "" {
		preheader = SystemName
	}

	var b strings.Builder
	b.WriteString(`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">`)
	b.WriteString(`<html xmlns="http://www.w3.org/1999/xhtml"><head>`)
	b.WriteString(`<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">`)
	b.WriteString(`<meta name="viewport" content="width=device-width,initial-scale=1.0">`)
	b.WriteString(`<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">`)
	b.WriteString(`<title>` + html.EscapeString(SystemName) + `</title></head>`)
	b.WriteString(`<body style="margin:0;padding:0;background-color:#F8F7F3;">`)

	// Hidden inbox preview text; the padding chain stops clients from leaking
	// the real body into the snippet line.
	b.WriteString(`<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">`)
	b.WriteString(html.EscapeString(preheader))
	b.WriteString(strings.Repeat("&zwnj;&nbsp;", 24))
	b.WriteString(`</div>`)

	b.WriteString(`<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#F8F7F3;">`)
	b.WriteString(`<tr><td align="center" style="padding:44px 16px 32px;">`)
	b.WriteString(`<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="width:100%;max-width:560px;">`)

	// Brand row
	b.WriteString(`<tr><td style="padding:0 4px 22px;">`)
	if logoURL := strings.TrimSpace(layout.LogoURL); logoURL != "" {
		b.WriteString(fmt.Sprintf(`<img src="%s" alt="%s" height="34" style="display:block;height:34px;max-width:200px;border:0;outline:none;">`,
			html.EscapeString(logoURL), html.EscapeString(SystemName)))
	} else {
		b.WriteString(fmt.Sprintf(`<span style="font-family:%s;font-size:18px;font-weight:600;letter-spacing:0.2em;color:#141413;">%s</span>`,
			emailFontSerif, html.EscapeString(SystemName)))
	}
	b.WriteString(`</td></tr>`)

	// Content card
	b.WriteString(`<tr><td style="background-color:#FFFFFF;border:1px solid #E8E4DA;border-radius:18px;padding:36px 36px 30px;`)
	b.WriteString(`font-family:` + emailFontSans + `;font-size:14px;line-height:1.75;color:#44433E;">`)
	b.WriteString(layout.Content)
	b.WriteString(`</td></tr>`)

	// Footer
	b.WriteString(`<tr><td align="center" style="padding:26px 12px 0;font-family:` + emailFontSans + `;font-size:12px;line-height:1.8;color:#9B988E;">`)
	if footer := strings.TrimSpace(layout.Footer); footer != "" {
		b.WriteString(html.EscapeString(footer) + `<br>`)
	}
	brand := html.EscapeString(SystemName)
	if siteURL := strings.TrimSpace(layout.SiteURL); siteURL != "" {
		brand = fmt.Sprintf(`<a href="%s" style="color:#9B988E;text-decoration:none;">%s</a>`,
			html.EscapeString(siteURL), brand)
	}
	b.WriteString(fmt.Sprintf(`&copy; %d %s`, time.Now().Year(), brand))
	b.WriteString(`</td></tr>`)

	b.WriteString(`</table></td></tr></table></body></html>`)
	return b.String()
}

// EmailParagraph renders a standard body-text block. The fragment may contain
// inline HTML (<a>, <strong>, <br>) authored in i18n strings.
func EmailParagraph(fragment string) string {
	return `<p style="margin:0 0 16px;font-family:` + emailFontSans + `;font-size:14px;line-height:1.75;color:#44433E;">` + fragment + `</p>`
}

// EmailMutedParagraph renders secondary text (validity notes, fallback links)
// in the quieter muted tone.
func EmailMutedParagraph(fragment string) string {
	return `<p style="margin:0 0 14px;font-family:` + emailFontSans + `;font-size:12.5px;line-height:1.7;color:#8B8980;">` + fragment + `</p>`
}

// EmailCodeBlock renders a verification code as a large monospace card so the
// code is easy to read and select for copying.
func EmailCodeBlock(code string) string {
	return `<div style="margin:6px 0 22px;padding:22px 16px;background-color:#F6F5F0;border:1px solid #E8E4DA;border-radius:14px;text-align:center;">` +
		`<span style="font-family:` + emailFontMono + `;font-size:30px;font-weight:700;letter-spacing:0.3em;color:#141413;-webkit-user-select:all;user-select:all;">` +
		html.EscapeString(code) + `</span></div>`
}

// EmailActionButton renders a pill call-to-action link.
func EmailActionButton(label, url string) string {
	return `<div style="margin:26px 0;text-align:center;"><a href="` + html.EscapeString(url) +
		`" target="_blank" style="display:inline-block;background-color:#141413;color:#FFFFFF;font-family:` + emailFontSans +
		`;font-size:14px;font-weight:500;text-decoration:none;padding:13px 36px;border-radius:999px;">` +
		html.EscapeString(label) + `</a></div>`
}

// EmailLogoURL resolves the configured Logo to an absolute URL usable in
// emails. Relative paths are anchored on the site ServerAddress; data URIs and
// empty values fall back to the text wordmark because most clients block them.
func EmailLogoURL(serverAddress string) string {
	logo := strings.TrimSpace(Logo)
	if logo == "" || strings.HasPrefix(logo, "data:") {
		return ""
	}
	if strings.HasPrefix(logo, "http://") || strings.HasPrefix(logo, "https://") {
		return logo
	}
	serverAddress = strings.TrimRight(strings.TrimSpace(serverAddress), "/")
	if serverAddress == "" {
		return ""
	}
	return serverAddress + "/" + strings.TrimLeft(logo, "/")
}

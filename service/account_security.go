package service

import (
	"fmt"
	"html"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/i18n"
	"github.com/QuantumNous/new-api/model"
	"github.com/QuantumNous/new-api/oauth"
	"github.com/QuantumNous/new-api/setting/system_setting"
)

func UnbindAccountOAuth(identity AuthIdentity, providerID int) error {
	enabled := model.AccountLoginMethods{
		Password: common.PasswordLoginEnabled,
		Passkey:  system_setting.PasskeySettingsSnapshot().Enabled,
		WeChat:   common.WeChatAuthEnabled,
	}
	for _, provider := range oauth.GetAllProviders() {
		if !provider.IsEnabled() {
			continue
		}
		if custom, ok := provider.(*oauth.GenericOAuthProvider); ok {
			enabled.CustomProviderIDs = append(enabled.CustomProviderIDs, custom.GetProviderId())
		} else {
			enabled.OAuthColumns = append(enabled.OAuthColumns, provider.ProviderUserIDColumn())
		}
	}
	return model.UnbindUserOAuthForSession(identity, providerID, enabled)
}

// NotifyAccountSecurityChange never includes credentials or tokens. The caller
// records delivery failure independently from the already-committed change.
func NotifyAccountSecurityChange(email, event string) error {
	if email == "" {
		return nil
	}
	subject := common.SystemName + " — Account security notification"
	// The event string is server-defined English, so the whole message stays in
	// English rather than mixing languages inside one email.
	content := common.RenderEmail(common.EmailLayout{
		Preheader: subject,
		Content: common.EmailParagraph(fmt.Sprintf("Your account security settings have changed: %s.", html.EscapeString(event))) +
			common.EmailMutedParagraph("If you did not make this change, open your account security settings, revoke other login sessions, and contact your administrator."),
		Footer:  i18n.Translate(i18n.LangEn, i18n.MsgEmailFooter, map[string]any{"SystemName": common.SystemName}),
		LogoURL: common.EmailLogoURL(system_setting.ServerAddress),
		SiteURL: system_setting.ServerAddress,
	})
	return common.SendEmail(subject, email, content)
}

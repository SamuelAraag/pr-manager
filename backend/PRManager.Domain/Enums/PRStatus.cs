namespace PRManager.Domain.Enums;

public enum PRStatus
{
    Open = 1,
    Approved = 2,
    NeedsCorrection = 3,
    VersionRequested = 4,
    DeployedToStaging = 5,
    Done = 6
}
